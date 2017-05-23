package com.cloud.ops.toscamodel.wf;

import com.cloud.ops.toscamodel.impl.Artifact;
import com.cloud.ops.toscamodel.impl.Interface;
import com.cloud.ops.toscamodel.impl.NodeTemplateDto;
import com.cloud.ops.toscamodel.impl.Topology;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import java.util.List;
import java.util.Map;

import static com.cloud.ops.toscamodel.wf.WorkFlow.ARTIFACT_PATH;
import static com.cloud.ops.toscamodel.wf.WorkFlow.PATCH_DEPLOY_WF;

/**
 * Created by Nathan on 2017/5/23.
 */
public class WorkFlowBuilder {


    public static Topology initWorkFlows(Topology topology) {
        Map<String, WorkFlow> wfs = topology.getWorkFlowMap();
        if (wfs == null) {
            wfs = Maps.newLinkedHashMap();
            topology.setWorkFlowMap(wfs);
        }
        deployPatchFilter(topology);

        return topology;
    }

    private static void deployPatchFilter(Topology topology) {
        for (Map.Entry<String, NodeTemplateDto> nodeMap : topology.getNodeTemplateMap().entrySet()) {
            for (Map.Entry<String, Interface> interfaceMap : nodeMap.getValue().getInterfaces().entrySet()) {
                if (interfaceMap.getKey().equals(PATCH_DEPLOY_WF)) {
                    WorkFlow wf = new WorkFlow();
                    wf.setName(PATCH_DEPLOY_WF);
                    wf.setSteps(processInterface(topology, nodeMap.getKey(), interfaceMap.getKey()));
                    topology.getWorkFlowMap().put(PATCH_DEPLOY_WF, wf);
                }
            }
        }
    }

    static List<WorkFlowStep> processInterface(Topology topology, String nodeName, String interfaceName) {
        List<WorkFlowStep> workFlowSteps = Lists.newArrayList();
        WorkFlowStep workFlowStep = new WorkFlowStep();
        workFlowStep.setName(interfaceName);
        Map<String, NodeTemplateDto> nodeMap = topology.getNodeTemplateMap();
        NodeTemplateDto doNode = nodeMap.get(nodeName);
        assert doNode != null;
        Interface doInterface = doNode.getInterfaces().get(interfaceName);
        assert doInterface != null;
        //1 process dependency
        if (doInterface.getDependencies() != null && !doInterface.getDependencies().isEmpty()) {
            for (Map<String, Object> dependency : doInterface.getDependencies()) {
                dependency.entrySet().stream().filter(entry -> entry.getValue() instanceof Map).forEach(entry -> {
                    Map dependencyMap = (Map) entry.getValue();
                    List doInterfaces = (List) dependencyMap.get("do_interface");
                    String doNodeName = (String) doInterfaces.get(0);
                    doNodeName = doNodeName.equals("SELF") ? nodeName : doNodeName;
                    String doInterfaceName = (String) doInterfaces.get(1);
                    //process interface recursively
                    workFlowSteps.addAll(processInterface(topology, doNodeName, doInterfaceName));
                });
            }
        }

        //2 process host requirement
        processHostRequirement(doNode, nodeMap, workFlowStep);

        //3 process inputs
        processInputs(nodeName, doInterface, nodeMap, workFlowStep);

        //4 process implement
        workFlowStep.setShellScript(doInterface.getImplementation());

        workFlowSteps.add(workFlowStep);
        return workFlowSteps;
    }

    static void processInputs(String nodeName, Interface doInterface, Map<String, NodeTemplateDto> nodeMap,
                              WorkFlowStep workFlowStep) {
        Map<String, String> ENVMap = Maps.newHashMap();
        for (Map.Entry<String, Object> inputMap : doInterface.getInputs().entrySet()) {
            Map inputValueMap = (Map) inputMap.getValue();
            if (inputValueMap.get("get_attribute") != null) {
                List<String> list = (List<String>) inputValueMap.get("get_attribute");
                String applyNodeName = list.get(0).equals("SELF") ? nodeName : list.get(0);
                String applyNodeAttribute = list.get(1);
                String value = (String) nodeMap.get(applyNodeName).getAttributes().get(applyNodeAttribute);
                ENVMap.put(inputMap.getKey(), value);
            }
            if (inputValueMap.get("get_artifact") != null) {
                List<String> list = (List<String>) inputValueMap.get("get_artifact");
                String applyNodeName = list.get(0).equals("SELF") ? nodeName : list.get(0);
                String applyNodeArtifact = list.get(1);
                Artifact artifact = nodeMap.get(applyNodeName).getArtifacts().get(applyNodeArtifact);
                ENVMap.put(inputMap.getKey(), ARTIFACT_PATH + "/" + artifact.getFile());
                workFlowStep.getArtifacts().add(artifact);
            }
        }
        workFlowStep.setEnv(ENVMap);
    }

    static void processHostRequirement(NodeTemplateDto doNode, Map<String, NodeTemplateDto> nodeMap,
                                       WorkFlowStep workFlowStep) {
        List<Map<String, Object>> requirements = doNode.getRequirements();
        String hostNodeName = null;
        for (Map<String, Object> requirement : requirements) {
            if (requirement.get("host") != null) {
                hostNodeName = (String) requirement.get("host");
            }
        }
        assert hostNodeName != null;
        workFlowStep.setHost(hostNodeName);
    }
}
