const { getJson } = require("serpapi");
const fs = require("fs");
const argv = require("node:process");
let Extract = require("./Extractor.js");
const async = require('async');
let figlet = require("figlet");
const gradient = require('gradient-string');
const fsPromises = require("fs/promises");
const csv = require('csvtojson');
const XLSX = require('xlsx');
const { all } = require("axios");


function shuffleArray(array) {
  // Sort the array using a random comparison function
  array.sort(() => Math.random() - 0.5);

  return array;
}



function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function readTextFileToArray(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const lines = contents.split(/\r?\n/); // Split by newline

  return lines;
}

let total = 0;

let extractor = new Extract();



async function keywords() {
    try {
      const files = await fsPromises.readdir("keywords");
  
      const txtFiles = files
        .filter((file) => file.endsWith(".txt"))
        .map((file) => file.slice(0, -4)); // Remove the ".txt" extension from each file name
  
      return txtFiles;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function csvs() {
    try {
      const files = await fsPromises.readdir("output");
  
      const txtFiles = files
        .filter((file) => file.endsWith(".csv"))
        .map((file) => file.slice(0, -4)); // Remove the ".txt" extension from each file name
  
      return txtFiles;
    } catch (err) {
      console.error(err);
      return [];
    }
  }




async function plsWork(inc, csv,word, api_key) {
    let str = "";
    let params = {
      api_key: api_key,
      q: "-intitle:\"profiles\" -inurl:\"dir/\" site:www.linkedin.com/in/ OR site:www.linkedin.com/pub/ intext:(\"" + word + "\") & (\"@gmail.com\"|\"@outlook.com\"|\"@icloud.com\"|\"@hotmail.com\"|\"@yahoo.com\"|\"@protonmail.com\"| \"@zoho.com\"| \"@aol.com\")",
      google_domain: "google.com",
      gl: "us",
      hl: "en",
      num: "100",
      start: inc
    };
    let data = await getJson("google", params).catch((err) => { data === undefined});

    if(data.hasOwnProperty('error')) {
      console.log(data.error);
      if(data.error === "Your searches for the month are exhausted. You can upgrade plans on SerpApi.com website.") {
        return false;
      }
      else if(data.error === "Invalid API key. Your API key should be here: https://serpapi.com/manage-api-key") {
        return undefined;
      }
      return null;
    }

    if(data.organic_results === undefined) { return null }

    for(let i = 0; i < data.organic_results.length; i++) {
      let newStr = data.organic_results[i].title + " " + data.organic_results[i].snippet;
      let out = extractor.extract(newStr);
      let names = extractor.extractName(newStr);
  
      if((names.length > 0) && (out.length > 0)) {
        str = str + '\n' + names + "," + out;

      }

    }
    let split = str.split("\n");
    total = total + split.length;
    const chalk = await import("chalk");
    console.log(chalk.default.green(`        [-] ${split.length.toString()} emails generated with keyword ${word}`));
    fs.appendFile(csv, str, (err) => {
      if (err) throw err;
    });extract

    if(split.length < 55) {
        return null;
    }

    return true;
  
  
  }

async function times(csv, words, api_key) {
  const chalk = await import("chalk");
    if (fs.existsSync(csv)) {
      } else {
        fs.appendFile(csv, "Names,Email1,Email2,Email3,Email4", (err) => {
            if (err) throw err;
        });
    }
    console.log(chalk.default.yellow("        [-] Using Serp-API key "+ api_key));
  let keywords = words;
  try {
    await async.eachSeries(keywords, async (word) => {
      let status = true;
      for (let i = 0; i < 3; i++) {
        if (status === undefined) {
          console.log(chalk.default.red("        [-] Serp-API key " + api_key + " is invalid"));
          throw new Error();
        } else if (status === null) {
          continue;
        } else if (status === false) {
          console.log(chalk.default.red("        [-] Serp-API key " + api_key + " has no more searches left."));
          throw new Error();
        }
        else {
          let num = i * 100;
          status = await plsWork(num, csv, word, api_key);
        }
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
  // The async.eachSeries call has finished executing without errors,
  // so we return true
  return true;
}

async function main() {
  while(true) {
    console.clear();

    ascIIart = '';

    let choices = await keywords();
    let csvser = await csvs();

    figlet.text("TheCloudy.com", {font: 'Ghost'}, (err, data) => {
        ascIIart = gradient.vice.multiline(data);
    });

    function title() {
        console.clear();
        console.log(ascIIart);
        console.log("");
    }

    await delay(100);

    console.log(ascIIart);
    console.log("");
    const chalk = await import("chalk");

    const inquirer = await import('inquirer');
    let answers = await inquirer.default.prompt({
        name:'func',
        type:'list',
        message:'[-] Welcome to the Cloudy Email Harvester, Pick any Service!\n\n',
        choices: ['Harvest Emails','Clean Duplicates in Email Lists', 'Quit']
    });

    if(answers.func === "Clean Duplicates in Email Lists") {
      title();
      let csv = await inquirer.default.prompt({
        name:'csv',
        type:'list',
        message:'[-] Pick a CSV File to Clean (The file will overwrite itself)\n\n',
        choices: csvser
       });

       let choice = "output/" + csv.csv;
       title();

       let overWriteChoice = await inquirer.default.prompt({
        name:'file',
        type:'list',
        message:'[-] Choose to Overwrite File or Create a New File (Overwriting Will Make List Shorter But Cleaner)\n\n',
        choices: ["Create New File","Overwrite"]
      });

      if(overWriteChoice.file === "Create New File") {
        let file = await extractor.cleanFileMakeNewOne(choice + ".csv");
        console.log(gradient.rainbow("\n\n        [-] Processes Finished! New File " + file + " Created and Cleaned!\n\n"));
      }
      else {
        let file = await extractor.cleanFile(choice + ".csv");
        console.log(gradient.rainbow("\n\n        [-] Processes Finished! File " + file + " has been Cleaned!\n\n"));
      }



    

    }


    else if(answers.func === "Harvest Emails") {
        title();
        let file = await inquirer.default.prompt({
            name:'file',
            type:'list',
            message:'[-] Pick a Keyword Library to Use\n\n',
            choices: choices
        });

        title();

        let csv = await inquirer.default.prompt({
            name:'csv',
            type:'input',
            message:'[-] Pick a CSV Filename to Create/Add to in the Output Folder\n\n  >',
        });

        let csvs = csv.csv
        if(!(csvs.endsWith(".csv"))) {
            csvs = csvs + ".csv";
        } 
        let words = fs.readFileSync('keywords/' + file.file + ".txt", 'utf-8');

        console.log("\n\n");
        let keywords = words.split("\n");
        keywords = shuffleArray(keywords);
        
        let len = 0;

        if(fs.existsSync("output/" + csvs)) {
          len = fs.readFileSync("output/" + csvs,'utf-8').split("\n").length;

          if(len !== 0) {
            len = len - 1;
          }
        }



        let allKeys = readTextFileToArray('API-Keys/Serp-API-Keys.txt');
        for(const key of allKeys) {
          await times("output/" + csvs,keywords, key);
        }
        let newLen = fs.readFileSync("output/" + csvs,'utf-8').split("\n").length;

        newLen = newLen - len -1;
        console.log(gradient.rainbow("        [-] Processes Finished! " + newLen + " emails generated in total!\n\n"));


        process.exit();
    }

    if(answers.func === "Quit") {
      process.exit();
    }

    const answer = await inquirer.default.prompt({
      name: 'repeat',
      type: 'list',
      message: 'Would You Like to Return to the Title Screen?',
      choices: ['Yes','No'],
    });

    if(answer.repeat === "Yes") {
      continue;
    }

    else {
      process.exit();
    }

  }

}

main();