import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';


// Set up your GitHub token (store securely in environment variable)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('Please set your GitHub token in the environment variable "GITHUB_TOKEN".');
}

// Configuration
const PROJECT_FILE = 'project1.md'; // File to read content from (adjust path if needed)
const GIST_FILENAME = 'project-summary.md'; // Filename for Gist
const LOCAL_SAVE_PATH = path.resolve(process.cwd(), 'exported-gist.md');

/**
 * Read content from a local file.
 * @param {string} filePath - Path to the file to read.
 * @returns {Promise<string>} - Content of the file.
 */
async function readContentFromFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Create a Gist on GitHub using the provided content.
 * @param {string} content - Markdown content to upload.
 * @param {string} filename - The filename for the Gist.
 * @param {string} description - Description of the Gist.
 * @param {boolean} isPublic - Boolean indicating if the Gist should be public.
 * @returns {Promise<Object>} - Response JSON containing the Gist details.
 */
async function createGist(content, filename, description = 'Project Task Tracker', isPublic = false) {
  const url = 'https://api.github.com/gists';
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  const body = {
    description,
    public: isPublic,
    files: {
      [filename]: { content }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Failed to create Gist: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save the content to a local Markdown file.
 * @param {string} content - The Markdown content to save.
 * @param {string} filePath - The file path where content should be saved.
 */
async function saveToLocal(content, filePath) {
  await writeFile(filePath, content, 'utf-8');
  console.log(`Saved Gist content to ${filePath}`);
}

async function main() {
  try {
    // Step 1: Read content from the local project file
    console.log(`Reading content from file: ${PROJECT_FILE}...`);
    const fileContent = await readContentFromFile(PROJECT_FILE);

    // Step 2: Create the Gist with the fetched content
    console.log('Creating a new Gist...');
    const gistResponse = await createGist(fileContent, GIST_FILENAME);

    const gistUrl = gistResponse.html_url;
    if (gistUrl) {
      console.log(`Gist created successfully: ${gistUrl}`);
    } else {
      console.log('Failed to retrieve the Gist URL.');
    }

    // Step 3: Save the content to a new local Markdown file
    console.log('Saving the Gist content locally...');
    await saveToLocal(fileContent, LOCAL_SAVE_PATH);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
