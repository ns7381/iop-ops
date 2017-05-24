/*
 * Copyright 2015 Universita' di Pisa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.cloud.ops.toscamodel.impl;

import com.cloud.ops.toscamodel.*;
import com.cloud.ops.toscamodel.basictypes.impl.TypeList;
import com.cloud.ops.toscamodel.basictypes.impl.TypeString;
import com.cloud.ops.toscamodel.wf.WorkFlowBuilder;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ToscaEnvironment implements IToscaEnvironment {

    public Object relationshipTemplate = null;
    private final TypeManager typeManager = new TypeManager(this);
    private TopologyContext topologyContext = null;
    private static final String relName = "normative_types.yaml";
    //    private static final String absName = "/com/cloud/ops/toscamodel/impl/normative_types.yaml";
    private String yamlFilePath = "";

    public ToscaEnvironment() {
        //ResourceBundle bundle = ResourceBundle.getBundle("seaclouds.utils.toscamodel.impl");
        //this.getClass().getResourceAsStream(absName);
        InputStream stream = this.getClass().getResourceAsStream(relName);
        readFile(new InputStreamReader(stream), true);
    }

    private void readFile(Reader input, boolean hideTypes) {
        final Parser parser = new Parser(this, hideTypes);
        parser.Parse(input);
    }

    @Override
    public void readFile(String yamlFilePath, boolean hideTypes) throws FileNotFoundException {
        this.yamlFilePath = yamlFilePath;
        final Parser parser = new Parser(this, hideTypes);
        parser.Parse(new FileReader(yamlFilePath));
    }

    @Override
    public void renameEntity(String entityName, String newEntityName) {
        typeManager.renameEntity(entityName, newEntityName);
    }

    @Override
    public void hideEntity(String entityName) {
        INamedEntity ret = getNamedEntity(entityName);
        if (ret instanceof NamedStruct)
            ((NamedStruct) ret).hidden = true;
        if (ret instanceof NamedNodeType)
            ((NamedNodeType) ret).hidden = true;
    }

    @Override
    public void unhideEntity(String entityName) {
        INamedEntity ret = getNamedEntity(entityName);
        if (ret instanceof NamedStruct)
            ((NamedStruct) ret).hidden = false;
        if (ret instanceof NamedNodeType)
            ((NamedNodeType) ret).hidden = false;
    }

    @Override
    public void writeFile(Writer output) {
        ToscaEmitter emitter = new ToscaEmitter();
        try {
            emitter.WriteDocument(output, this);
        } catch (IOException e) {
            throw new RuntimeException("zomg!");
        }

    }

    @Override
    public INamedEntity getNamedEntity(String entityName) {
        INamedEntity ret = null;
        if (ret == null)
            ret = (INamedEntity) typeManager.getNodeTemplate(entityName);
        if (ret == null)
            ret = (INamedEntity) typeManager.getNodeType(entityName);
        if (ret == null)
            ret = (INamedEntity) typeManager.getType(entityName);

        return ret;
    }


    @Override
    public Iterable<INodeTemplate> getNodeTemplatesOfType(INodeType rootType) {
        //return topology.getNodeTemplatesOfType(INodeType rootType);
        return typeManager.getNodeTemplatesOfType(rootType);
    }


    public TopologyContext getTopologyContext() {
        if (this.topologyContext == null) {
            INodeType rootNode = (INodeType) this.getNamedEntity("tosca.nodes.Root");
            Iterable<INodeTemplate> rootNodeTemplate = this.getNodeTemplatesOfType(rootNode);
            Map<String, NodeTemplateDto> nodeTemplateDtoMap = new HashMap<>();
            for (INodeTemplate nodeTemplate : rootNodeTemplate) {
                nodeTemplateDtoMap.put(nodeTemplate.toString(), NodeTemplateDto.convert(nodeTemplate));
            }
            this.topologyContext = TopologyContext.builder().nodeTemplateMap(nodeTemplateDtoMap).build();
        }
        return this.topologyContext;
    }


    @Override
    public TopologyContext getTopologyWithWorkFlows() {
        if (this.topologyContext == null) {
            this.getTopologyContext();
        }
        if (this.topologyContext.getWorkFlowMap() == null) {
            WorkFlowBuilder.initWorkFlows(this.topologyContext);
        }
        return this.topologyContext;
    }

    @Override
    public Iterable<INodeType> getNodeTypesDerivingFrom(INodeType rootType) {
        return typeManager.getNodeTypesDerivingFrom(rootType);
    }

    @Override
    public Iterable<ITypeStruct> getTypesDerivingFrom(ITypeStruct rootType) {

        return typeManager.getTypesDerivingFrom(rootType);
    }

    @Override
    public INamedEntity registerType(String entityName, IType t) {
        return typeManager.registerType(entityName, t);
    }

    @Override
    public INamedEntity registerNodeType(String entityName, INodeType t) {
        return typeManager.registerNodeType(entityName, t);
    }

    @Override
    public INamedEntity registerNodeTemplate(String entityName, INodeTemplate t) {
        return typeManager.registerNodeTemplate(entityName, t);
    }

    @Override
    public INamedEntity importWithSupertypes(INamedEntity entity) {
        INamedEntity res = getNamedEntity(entity.name());
        if (res != null)
            return res;
        if (entity instanceof INodeType) res = typeManager.importNodeType(entity);
        else if (entity instanceof INodeTemplate) res = typeManager.importNodeTemplate(entity);
        else if (entity instanceof ITypeStruct) res = typeManager.importStructType(entity);
        else {
            throw new NotImplementedException();
        }
        return res;
    }

    @Override
    public INodeTemplate newTemplate(INodeType type) {
        return new NodeTemplate((NamedNodeType) type, "", Collections.emptyMap(), Collections.emptyMap());
    }

    public void updateAttribute(String nodeId, Map<String, Object> attributes) {
        try {
            INodeType nodeTypes = (INodeType) this.getNamedEntity("tosca.nodes.Root");
            Iterable<INodeTemplate> nodes = this.getNodeTemplatesOfType(nodeTypes);
            for (INodeTemplate node : nodes) {
                if (nodeId.equals(node.toString())) {
                    for (Map.Entry<String, Object> attribute : attributes.entrySet()) {
                        Object value = attribute.getValue();
                        if (value instanceof String) {
                            node.declaredAttributes().put(attribute.getKey(), TypeString.instance().instantiate(value));
                        } else if (value instanceof List) {
                            node.declaredAttributes().put(attribute.getKey(), TypeList.instance(TypeString.instance()).instantiate(value));
                        }
                    }
                }
            }
            this.writeFile(new FileWriter(yamlFilePath));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
};
