const fs = require('fs');
const path = require('path');
const zipper = require("zip-local");

const packRepertoire =  (pathsrc,pathdest) => {
    let maDate = new Date();
    let annee = maDate.getFullYear();
    let mois = maDate.getMonth()+1;
    let jour = maDate.getDate();
    let heures = maDate.getHours();
    let minutes = maDate.getMinutes();
    let secondes = maDate.getSeconds();
    if(heures < 10){
        heures = '0'+mois;
    }
    if(minutes < 10){
        minutes = '0'+minutes;
    }
    if(secondes < 10){
        secondes = '0'+secondes;
    }
    if(mois < 10){
        mois = '0'+mois;
    }
    if(jour < 10){
        jour = '0'+jour;
    }
    let timestamp = heures +' H '+minutes+' : '+secondes;
    let date = annee+'-'+mois+'-'+jour;
    const nouveauChemin = path.resolve(pathdest.slice(0,pathdest.indexOf('/')));
    zipper.sync.zip(pathsrc).compress().save(nouveauChemin+'/'+'BUP-'+date+'.tar.gz');
    creerLog(timestamp,pathdest,date);
};

const restaure = (pathsrc,pathdest) =>{
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
        console.log("Sauvegarde Réussi !")
    }
}

const creerLog = (timestamp,pathdest,date) => {
    if(!fs.existsSync('./Meslog/')){
        fs.mkdirSync('./Meslog/');
            let logger = fs.createWriteStream('./Meslog/logbup.txt', { flags: 'a'});
            logger.write('Chemin de la sauvegarde '+path.resolve(pathdest)+'le : '+date+' à '+timestamp+"\r\n");
    }else{
            let logger = fs.createWriteStream('./Meslog/logbup.txt'+"\r\n", { flags: 'a'});
            logger.write('Chemin de la sauvegarde '+path.resolve(pathdest)+'le : '+date+' à '+timestamp+"\r\n");
    }
};

const sauvegardeMinuteur = (pathsrc,pathdest,minutes) => {
    console.log("Appuyez sur CTRL+C pour stopper le programme");
    let secondes = minutes * 60;
    setInterval(()=>{sauvegarde(pathsrc,pathdest)},secondes);
}

module.exports={
    sauvegarde,
    restaure,
    sauvegardeMinuteur,
}