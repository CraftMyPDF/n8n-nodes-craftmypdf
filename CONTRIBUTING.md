# Contributing to n8n-nodes-craftmypdf

# Bugs and features

Whether it's a bug report or feature request, you're welcome to raise an
**[issue](https://github.com/CraftMyPDF/n8n-nodes-craftmypdf/issues)**.

# Environment setup

## Requirements

- Node.js (https://nodejs.org/en)
- pnpm

  > [!TIP]
  > Can be installed with `corepack enable pnpm`, see https://nodejs.org/api/corepack.html.

- n8n

  > [!TIP]
  > Can be installed with `npm install --global n8n`.

## Local environment

### Run n8n-nodes-craftmypdf locally

At the time of writing, the [official documentation](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) is outdated and still uses `npm`.

1. Build `n8n-nodes-craftmypdf`.

   ```
   # In the n8n-nodes-craftmypdf directory, run
   pnpm run build

   # You should see the `dist` folder in the n8n-nodes-craftpdf directory now
   ```

2. Make sure the `custom` directory exists in `~/.n8n` local installation.

   ```
   # In ~/.n8n directory, run
   mkdir custom
   cd custom
   pnpm init
   ```

3. Link `n8n-nodes-craftmypdf` to n8n's `custom` directory. You should see an output like this:

   ```
   ~/.n8n/custom ❯ pnpm link /home/tux/Desktop/github/n8n-nodes-craftmypdf

    WARN  The package n8n-nodes-craftmypdf, which you have just pnpm linked, has the following peerDependencies specified in its package.json:

   - n8n-workflow@*

   The linked in dependency will not resolve the peer dependencies from the target node_modules.
   This might cause issues in your project. To resolve this, you may use the "file:" protocol to reference the local dependency.

   node_modules:
   + n8n-nodes-craftmypdf 0.1.2 <- ../../Desktop/github/n8n-nodes-craftmypdf
   ```

4. Start n8n

   ```
   ~/.n8n/custom ❯ n8n start                                                                                                                                               nnn 1
   User settings loaded from: /home/tux/.n8n/config
   Initializing n8n process
   n8n ready on 0.0.0.0, port 5678
   n8n detected that some packages are missing. For more information, visit https://docs.n8n.io/integrations/community-nodes/troubleshooting/
   Version: 1.65.2

   Editor is now accessible via:
   http://localhost:5678/

   Press "o" to open in Browser.
   ```

5. Open n8n via `http://localhost:5678/`. You should see the "CraftMyPdf" node when you search for it.

   ![2024-11-01_22-31](https://github.com/user-attachments/assets/1c522a6b-a77a-4163-8911-a9ed0fb4a290)
