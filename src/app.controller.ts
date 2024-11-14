import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as marked from 'marked';

@Controller()
export class AppController {
  @Get()
  async getGreeting(@Res() res: Response) {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, 'greeting.md'),
      path.join(__dirname, '..', 'greeting.md'),
      path.join(process.cwd(), 'dist', 'greeting.md')
    ];

    console.log('Searching for greeting.md in:');
    possiblePaths.forEach(p => console.log('- ' + p));

    // Try each path until we find the file
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log('Found file at: ' + filePath);
        const markdown = fs.readFileSync(filePath, 'utf8');
        const html = marked.parse(markdown);
        return res.send(html);
      }
    }

    console.log('File not found in any location');
    return res.status(404).send('Greeting file not found.');
  }
}
