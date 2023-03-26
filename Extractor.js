const emailsInString = require("emails-in-string");
const fs = require("fs");
class nameExtract {


    emailExtensions = [
        "@gmail.com",
        "@yahoo.com",
        "@hotmail.com",
        "@outlook.com",
        "@icloud.com",
        "@aol.com",
        "@msn.com",
        "@live.com",
        "@comcast.net",
        "@verizon.net",
        "@sbcglobal.net",
        "@yahoo.co.in",
        "@gmail.co.in",
        "@rediffmail.com",
        "@ymail.com",
        "@att.net",
        "@mac.com",
        "@bellsouth.net",
        "@zoho.com",
        "@protonmail.com",
        "@mail.com",
        "@yandex.com",
        "@fastmail.com",
        "@gmx.com",
        "@mailbox.org",
        "@startmail.com",
        "@tutanota.com",
        "@runbox.com",
        "@hushmail.com",
        "@posteo.de",
        "@kolabnow.com",
        "@mailfence.com",
        "@mailbox.eu",
        "@mail.ru"
    ];
    
    
    
    
    
    
    constructor() {}

    extract(emails) {
        let extracted = emailsInString(emails);
        let strExt = extracted.join("\n");
        let overs = strExt.replace("(", "");
        let oversite = overs.replace(")", "");
        let over = oversite.replace(/\//g, "");
        let strExtract = this.cleaner(over);
        let overa = strExtract.replace("\n", ",");

        return overa;
    }

    delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

    async append(str, file) {
        let st = cleaner(str);
        let arr = st.split("\n");
        let newarr = removeDuplicates(arr);
        let stri = newarr.join("\n");
        fs.appendFile(file, "\n" +stri, (err) => 
        { 
            if (err) { 
                console.log(err); 
            } 
        });
    }

    extractName(str) {
        let stringo = str.split(" - ");
        let stringy = stringo[0].split(" | ");
        let stringp  = stringy[0].split(",")[0].split("(")[0].split("{")[0];
        let emails = emailsInString(stringp);
        emails.forEach(email => {
            stringp = stringp.split(email)[0];
        });
    
        let parsedName = stringp;
        let match = parsedName.match(/\s\([0-9]\)/);
        if (match) {
            parsedName = parsedName.slice(0, match.index);
        }
    
        match = parsedName.match(/\s[0-9]/);
        if (match) {
            parsedName = parsedName.slice(0, match.index);
        }
    
        return parsedName.trim();
    }

    cleaner(str) {
        let splitter = str.split('\n');
        let newSplit = [];
        for(let i = 0; i < splitter.length; i++) {
            this.emailExtensions.forEach(email => {
                if(splitter[i].includes(email)) {
                    splitter[i] = splitter[i].substring(0, ( splitter[i].indexOf(email) + email.length ));
                    newSplit.push(splitter[i]);
                }
            });
    
            
        }
        let newSplits = this.removeDuplicates(newSplit);
        let newStr = newSplits.join("\n");
        return newStr;
    }

    removeDuplicates(arr) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }
    
    async content(path) {  
        return fs.readFileSync(path, 'utf-8');
      }
    
    
    async cleanFile(path) {
        let text = fs.readFileSync(path, 'utf-8');
        let arr = text.split("\n");
        let newarr = this.removeDuplicates(arr);
        newarr = this.getRidOfSpaces(newarr);
        let stri = newarr.join("\n");
        fs.writeFileSync(path, stri);
    }

    async cleanFileMakeNewOne(path) {
        let text = fs.readFileSync(path, 'utf-8');
        let arr = text.split("\n");
        let newarr = this.removeDuplicates(arr);
        newarr = this.getRidOfSpaces(newarr);
        let stri = newarr.join("\n");
        let splitFi = path.split(".");
        let spl = "";
        for(let x = 0; x < splitFi.length; x++) {
            if(x !== splitFi.length -1) {
                if(x === 0) {
                    spl = splitFi[0];
                }
                else {
                    spl = spl + "." + splitFi[x];
                }
                
            }
        }
        let newFi = spl + '-Cleaned.'+ splitFi[splitFi.length - 1];
        fs.writeFileSync(newFi, stri);
        return newFi.split('/')[1];
    }
    
    getRidOfSpaces(arr) {
        let newArr = [];
        arr.forEach(element => {
            if(element.trim() != 0) {
                newArr.push(element);
            }
        });
    
        return newArr;
    }
    




}


module.exports = nameExtract;
