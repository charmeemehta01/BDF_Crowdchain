const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const cfPath = path.resolve(__dirname, 'contracts', 'Crowdfunding.sol');
const diPath = path.resolve(__dirname, 'contracts', 'DigitalIdentity.sol');
const cfSource = fs.readFileSync(cfPath, 'utf8');
const diSource = fs.readFileSync(diPath, 'utf8');

function compilingPreperations() {
    const buildPath = path.resolve(__dirname, 'build');
    fs.removeSync(buildPath);
    return buildPath;
}

function createConfiguration() {
    return {
        language: 'Solidity',
        sources: {
            'Crowdfunding': {
                content: cfSource
            },
            'DigitalIdentity': {
                content: diSource
            }
        },
        settings: {
            outputSelection: { // return everything
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config)));
    } catch (e) {
        console.log(e);
    }
}

function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);

    for (let contractFileName in compiled) {
        console.log('Writing: ', contractFileName + '.json');
        fs.outputJsonSync(
            path.resolve(buildPath, contractFileName + '.json'),
            compiled[contractFileName]
        );
    }
}
const buildPath = compilingPreperations();
const config = createConfiguration();
const compiled = compileSources(config);
writeOutput(compiled.contracts.Crowdfunding, buildPath);
writeOutput(compiled.contracts.DigitalIdentity, buildPath);

