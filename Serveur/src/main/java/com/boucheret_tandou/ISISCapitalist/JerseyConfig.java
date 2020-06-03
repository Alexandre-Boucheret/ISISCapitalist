package com.boucheret_tandou.ISISCapitalist;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

@Component 
@ApplicationPath("/adventureisis") 
public class JerseyConfig extends ResourceConfig { 
    public JerseyConfig() { 
        register(WebService.class); 
        register(CORSResponseFilter.class);
    } 
}