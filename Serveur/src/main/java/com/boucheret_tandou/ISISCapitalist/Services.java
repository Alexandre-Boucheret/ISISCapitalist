package com.boucheret_tandou.ISISCapitalist;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.boucheret_tandou.ISISCapitalist.generated.PallierType;
import com.boucheret_tandou.ISISCapitalist.generated.ProductType;
import com.boucheret_tandou.ISISCapitalist.generated.World;

public class Services {

    public World readWorldFromXml(String username) {
        JAXBContext context;
        World world = null;
        InputStream input = null;

        try {
            input = new FileInputStream(username + "_world.xml");
            context = JAXBContext.newInstance(World.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            world = (World) unmarshaller.unmarshal(input);
        } catch (Exception e) { }

        if(input == null){
            input = getClass().getClassLoader().getResourceAsStream("world.xml");
            try {
                context = JAXBContext.newInstance(World.class);
                Unmarshaller unmarshaller = context.createUnmarshaller();
                world = (World) unmarshaller.unmarshal(input);
            } catch (JAXBException e) { }
            
        }

        return world;
    }

    public void saveWorldToXml(String username, World world) {
        if(username == null) return;
        
        JAXBContext context;
        try {
            context = JAXBContext.newInstance(World.class);
            Marshaller marshaller = context.createMarshaller();
            File file = new File(username + "_world.xml");
            OutputStream output = new FileOutputStream(file);
            world.setLastupdate(System.currentTimeMillis());
            marshaller.marshal(world, output);
        } catch (JAXBException | FileNotFoundException e) {
        }
        
    }

    public World getWorld(String username) {
        World world = readWorldFromXml(username);
        updateScore(world);
        saveWorldToXml(username, world);

        return world;
    }

    public Boolean updateProduct(String username, ProductType newproduct) {
        World world = getWorld(username); 
        ProductType product = findProductById(world, newproduct.getId()); 
        if (product == null) { return false;} 

        int qtchange = newproduct.getQuantite() - product.getQuantite(); 
        if (qtchange > 0) {
            double solde = world.getMoney() - qtchange * product.getCout();
            world.setMoney(solde);
            product.setQuantite(newproduct.getQuantite());

            List<PallierType> unlocks = checkUnlocks(world, product);
            if(unlocks.size() > 0){
                for(PallierType unlock : unlocks){
                    applyUpgrade(world, unlock);
                }
            }
        } else { 
            product.setTimeleft(product.getVitesse());           
        }
        saveWorldToXml(username, world); 
        return true; 
	}

    public Boolean updateManager(String username, PallierType newmanager) {
        World world = getWorld(username);
        PallierType manager = findManagerByName(world, newmanager.getName()); 
        if (manager == null) { return false; } 

        ProductType product = findProductById(world, manager.getIdcible()); 
        if (product == null) { return false; } 

        manager.setUnlocked(true);
        double solde = world.getMoney() - manager.getSeuil();
        world.setMoney(solde);
        saveWorldToXml(username, world); 
        return true;
    }

	private void updateScore(World world) {
        double solde = 0;
        long tempsEcoule = System.currentTimeMillis() - world.getLastupdate();
        for(ProductType p : world.getProducts().getProduct()){
            if(!p.isManagerUnlocked()){
                if(p.getTimeleft() > 0){
                    if(p.getTimeleft() < tempsEcoule){
                        p.setTimeleft(0);
                        solde += p.getRevenu() * p.getQuantite();
                    }else{
                        p.setTimeleft(p.getTimeleft()-tempsEcoule);
                    }
                }
            }else{
                solde += p.getRevenu() * p.getQuantite() * (tempsEcoule / p.getVitesse());
                p.setTimeleft(tempsEcoule % p.getVitesse()); 
            }
        }
        world.setScore(world.getScore() + solde);
        world.setMoney(world.getMoney() + solde);
    }

	public Boolean updateUpgrade(String username, PallierType newupgrade) {
        World world = getWorld(username);
        PallierType upgrade = findManagerByName(world, newupgrade.getName()); 
        if (upgrade == null) { return false; } 

        ProductType product = findProductById(world, upgrade.getIdcible()); 
        if (product == null) { return false; } 

        upgrade.setUnlocked(true);
        double solde = world.getMoney() - upgrade.getSeuil();
        world.setMoney(solde);
        saveWorldToXml(username, world); 
        return true;
	}

	public Boolean updateAngelUpgrade(String username, PallierType newangelupgrade) {
        World world = getWorld(username);
        PallierType angelupgrade = findManagerByName(world, newangelupgrade.getName()); 
        if (angelupgrade == null) { return false; } 

        ProductType product = findProductById(world, angelupgrade.getIdcible()); 
        if (product == null) { return false; } 

        angelupgrade.setUnlocked(true);
        double solde = world.getMoney() - angelupgrade.getSeuil();
        world.setMoney(solde);
        saveWorldToXml(username, world); 
        return true;
	}

	public Boolean deleteWorld(String username) {
        if(username == null) return false;
        World world = getWorld(username);
        World newWorld = readWorldFromXml(null);

        newWorld.setScore(world.getScore());
        newWorld.setActiveangels(world.getActiveangels());
        newWorld.setTotalangels(world.getTotalangels());

        for(ProductType product : newWorld.getProducts().getProduct()){
            double revenue = product.getQuantite() * product.getRevenu() * (1 + newWorld.getActiveangels() * newWorld.getAngelbonus() / 100);
            product.setRevenu(revenue);
        }
        
        saveWorldToXml(username, newWorld);
		return true;
	}

    private void applyUpgrade(World world, PallierType unlock){
        if(!unlock.isUnlocked()){
            if(unlock.getIdcible() == 0){
                for(ProductType product : world.getProducts().getProduct()){
                    switch (unlock.getTyperatio()) {
                        case VITESSE:
                            product.setVitesse((int)(product.getVitesse()/unlock.getRatio()));
                            break;
                        case GAIN:
                            product.setRevenu(product.getRevenu()*unlock.getRatio());
                            break;
                        case ANGE:
                            world.setAngelbonus((int)(world.getAngelbonus()+unlock.getRatio()));
                            break;                
                        default:
                            break;
                    }
                }
            }else{
                ProductType product = findProductById(world, unlock.getIdcible());
                switch (unlock.getTyperatio()) {
                    case VITESSE:
                        product.setVitesse((int)(product.getVitesse()/unlock.getRatio()));
                        break;
                    case GAIN:
                        product.setRevenu(product.getRevenu()*unlock.getRatio());
                        break;
                    case ANGE:
                        world.setAngelbonus((int)(world.getAngelbonus()+unlock.getRatio()));
                        break;                
                    default:
                        break;
                }
            }
            unlock.setUnlocked(true);
        }
    }

    private PallierType findManagerByName(World world, String name) {
        return world.getManagers().getPallier()
                                    .stream()
                                    .filter(p -> p.getName().equals(name))
                                    .findFirst()
                                    .get();
    }

    private List<PallierType> checkUnlocks(World world, ProductType product) {
        int minQuantiteCalc = product.getQuantite();
        for(ProductType p : world.getProducts().getProduct()){
            minQuantiteCalc = Math.min(p.getQuantite(), minQuantiteCalc);
        }

        final int minQuantiteAllProd = minQuantiteCalc;

        List<PallierType> productUnlock = product.getPalliers().getPallier()
                                                .stream()
                                                .filter(p -> p.isUnlocked() == false && p.getSeuil() <= product.getQuantite())
                                                .collect(Collectors.toList());

        List<PallierType> allUnlock = world.getAllunlocks().getPallier()
                                                .stream()
                                                .filter(p -> p.isUnlocked() == false && p.getSeuil() <= minQuantiteAllProd)
                                                .collect(Collectors.toList());                                             
                                      
        return Stream.concat(productUnlock.stream(), allUnlock.stream()).collect(Collectors.toList());
    }
    
    private ProductType findProductById(World world, int id) {
        return world.getProducts().getProduct()
                                    .stream()
                                    .filter(p -> p.getId() == id)
                                    .findFirst()
                                    .get();
    }

}