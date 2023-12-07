import fetch from 'node-fetch';
import fs from 'fs';

export async function getInput(day) {
    const cookie = fs.readFileSync('../cookie', 'utf-8');
    const headers = {
        'Cookie': cookie
    }
    const inputResponse = await fetch(`https://adventofcode.com/2023/day/${day}/input`, {
        method: 'GET',
        headers: headers
    });
    if (inputResponse.ok) {
        return await inputResponse.text();
    } else {
        console.error(inputResponse.status, inputResponse.statusText);
    }
}

export async function writeJsonFile(jsonObject, file) {
    fs.writeFileSync(file, JSON.stringify(jsonObject));
}