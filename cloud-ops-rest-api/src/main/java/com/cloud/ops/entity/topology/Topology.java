package com.cloud.ops.entity.topology;

import com.cloud.ops.dao.modal.BaseObject;
import com.cloud.ops.toscamodel.impl.TopologyContext;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;

/**
 * Created by Administrator on 2017/1/13.
 */
@Entity
@Table(name="topology")
public class Topology extends BaseObject {
    String yamlFilePath;
    TopologyContext topologyContext;
    List<String> fileContents;

    public String getYamlFilePath() {
        return yamlFilePath;
    }

    public void setYamlFilePath(String yamlFilePath) {
        this.yamlFilePath = yamlFilePath;
    }

    @Transient
    public TopologyContext getTopologyContext() {
        return topologyContext;
    }

    public void setTopologyContext(TopologyContext topologyContext) {
        this.topologyContext = topologyContext;
    }

    @Transient
    public List<String> getFileContents() {
        return fileContents;
    }

    public void setFileContents(List<String> fileContents) {
        this.fileContents = fileContents;
    }
}


