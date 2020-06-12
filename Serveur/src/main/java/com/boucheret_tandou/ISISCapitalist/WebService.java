package com.boucheret_tandou.ISISCapitalist;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.boucheret_tandou.ISISCapitalist.generated.PallierType;
import com.boucheret_tandou.ISISCapitalist.generated.ProductType;

import org.springframework.web.bind.annotation.RequestBody;

@Path("generic")
public class WebService {
    
    Services services;

    public WebService() {
        services = new Services();
    }

    @GET
    @Path("world")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response getWorld(@HeaderParam("X-User") String username){
        return Response.ok(services.getWorld(username)).build();
    }

    @PUT
    @Path("product")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response putProduct(@HeaderParam("X-User") String username, @RequestBody ProductType newproduct){
        return Response.ok(services.updateProduct(username, newproduct)).build();
    }
    
    @PUT
    @Path("manager")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response putManager(@HeaderParam("X-User") String username, @RequestBody PallierType newmanager){
        return Response.ok(services.updateManager(username, newmanager)).build();
    }

    @PUT
    @Path("upgrade")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response putUpgrade(@HeaderParam("X-User") String username, @RequestBody PallierType newupgrade){
        return Response.ok(services.updateUpgrade(username, newupgrade)).build();
    }
    
    @PUT
    @Path("angelupgrade")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response putAngelUpgrade(@HeaderParam("X-User") String username, @RequestBody PallierType newangelupgrade){
        return Response.ok(services.updateAngelUpgrade(username, newangelupgrade)).build();
    }

    @DELETE
    @Path("world")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response deleteWorld(@HeaderParam("X-User") String username){
        return Response.ok(services.deleteWorld(username)).build();
    }
}