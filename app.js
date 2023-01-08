const fs = require('fs');
const path = require('path');
const zipper = require("zip-local");

const getDate = () => {
    let maDate = new Date();
    let annee = maDate.getFullYear();
    let mois = maDate.getMonth()+1;
    let jour = maDate.getDate();
    let date = annee+'-'+mois+'-'+jour;
    return date;
}

const packRepertoire =  (pathsrc,pathdest) => {
    const nouveauChemin = path.resolve(pathdest.slice(0,pathdest.indexOf('/')));
    const nomFichiers = nouveauChemin+'/'+'BUP-'+getDate()+0+'.tar.gz';
    zipper.sync.zip(pathsrc).compress().save(nouveauChemin+'/'+'BUP-'+getDate()+'.tar.gz');
};

const unpackRepertoire = (pathsrc,pathdest) =>{
    if(!fs.existsSync(pathdest)){
        fs.mkdirSync(pathdest);
        zipper.sync.unzip(pathsrc).save(pathdest);
    }else{
        zipper.sync.unzip(pathsrc).save(pathdest);
    }
}

const sauvegarde = (pathsrc,pathdest) => {
    const existe = fs.existsSync(pathsrc);
    const etat = existe && fs.statSync(pathsrc);
    const estUnRepertoire = etat && etat.isDirectory();
    if(estUnRepertoire){
        if(!fs.existsSync(pathdest)) {
            fs.mkdirSync(pathdest);
            fs.readdirSync(pathsrc).forEach(fichiers => {
                sauvegarde(path.join(pathsrc, fichiers), path.join(pathdest, fichiers));
            });
        }else{
            fs.readdirSync(pathsrc).forEach(fichiers => {
                sauvegarde(path.join(pathsrc, fichiers), path.join(pathdest, fichiers));
            });
        }
    }else {
        packRepertoire(pathsrc,pathdest);
    }
}

const sauvegardeMinuter = (pathsrc,pathdest) => {
    setInterval(sauvegarde(pathsrc,pathdest),5000);
}

sauvegarde('./origine','./destination');
unpackRepertoire('./destination/BUP-2023-1-8.tar.gz','./BUP-2023-1-8');
sauvegardeMinuter('./origine','./destination');