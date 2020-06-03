package com.boucheret_tandou.ISISCapitalist;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.boucheret_tandou.ISISCapitalist.generated.World;

public class Services {

    File file = new File("world.xml");
    InputStream input = getClass().getClassLoader().getResourceAsStream("world.xml");

    public World readWorldFromXml() {
        JAXBContext context;
        World world = null;
        try {
            context = JAXBContext.newInstance(World.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            world = (World) unmarshaller.unmarshal(input);
        } catch (Exception e) {
            //TODO: handle exception
        }
       

        return world;
    }

    public void saveWorldToXml(World world) throws JAXBException, FileNotFoundException {
        JAXBContext context;
        context = JAXBContext.newInstance(World.class);
        Marshaller marshaller = context.createMarshaller();
        OutputStream output = new FileOutputStream(file);
        marshaller.marshal(world, output);
    }

    public World getWorld() {
        return readWorldFromXml();
    }
}