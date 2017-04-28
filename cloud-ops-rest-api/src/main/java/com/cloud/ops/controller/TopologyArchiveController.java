package com.cloud.ops.controller;

import com.cloud.ops.entity.topology.TopologyArchive;
import com.cloud.ops.service.TopologyArchiveService;
import com.cloud.ops.service.TopologyService;
import com.cloud.ops.store.FileStore;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Authorization;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;

@RestController
@RequestMapping(value = "/topologies/{topologyId}/archives")
public class TopologyArchiveController {

    @Autowired
    private TopologyArchiveService service;
    @Autowired
    private TopologyService topologyService;
    @Autowired
    private FileStore fileStore;

    @ApiOperation(value = "create topology's archive.", authorizations = { @Authorization("ADMIN") })
    @PostMapping(headers = "content-type=multipart/form-data")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseBody
    public TopologyArchive create(@RequestParam("file") final MultipartFile file, @PathVariable String topologyId) throws IOException {
        String filePath = fileStore.storeFile(file.getInputStream(), FileStore.TOPOLOGY_FILE_PATH +
                topologyService.get(topologyId).getName() + File.separator + file.getOriginalFilename());
        TopologyArchive archive = new TopologyArchive();
        archive.setName(file.getOriginalFilename());
        archive.setTopologyId(topologyId);
        archive.setFilePath(filePath);
        return service.create(archive);
    }

    @ApiOperation(value = "create topology's archive.", authorizations = { @Authorization("ADMIN") })
    @PostMapping(value = "{id}/override")
    @PreAuthorize("hasAuthority('ADMIN')")
    public TopologyArchive update(@RequestParam("file") MultipartFile file, @PathVariable String topologyId,
                                  @PathVariable String id) throws IOException {
        TopologyArchive archive = service.get(id);
        if (StringUtils.isNotBlank(archive.getFilePath())) {
            fileStore.delete(archive.getFilePath());
        }
        String filePath = fileStore.storeFile(file.getInputStream(), FileStore.TOPOLOGY_FILE_PATH +
                topologyService.get(topologyId).getName() + File.separator + file.getOriginalFilename());
        archive.setFilePath(filePath);
        return service.update(archive);
    }

    /**
     * 删除
     *
     * @return
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public Boolean delete(@PathVariable String topologyId, @PathVariable String id) {
        service.delete(id);
        return Boolean.TRUE;
    }

    /**
     * 编辑
     *
     * @return
     */
    @RequestMapping(method = RequestMethod.PUT)
    public TopologyArchive update(@PathVariable String topologyId, @RequestBody TopologyArchive entity) {
        entity.setId(topologyId);
        return service.update(entity);
    }

    /**
     * 获取所有数据
     *
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<TopologyArchive> getByTopologyId(@PathVariable String topologyId) throws IOException {
        List<TopologyArchive> archives = service.findByTopologyId(topologyId);
        for (TopologyArchive archive : archives) {
            archive.setFileContents(IOUtils.readLines(new FileInputStream(archive.getFilePath()), "UTF-8"));
        }
        return archives;
    }
}
