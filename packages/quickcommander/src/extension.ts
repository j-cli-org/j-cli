// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Record<string, vscode.CompletionItem[]>
let _snippets: { all: vscode.CompletionItem[], [key: string]: vscode.CompletionItem[] } = Object.create(null);
let _registeredProvider: { all: vscode.Disposable, [key: string]: vscode.Disposable } = Object.create(null);
const languageType: string[] = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue-html', 'vue'];

class RegisteredProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
		let snippetId = 'all';
		return _snippets[snippetId];
	}
}


function parseSnippets(file: string): vscode.CompletionItem[] {
	try {
		if (file === '') {return [];}

		const snippets: Record<string, any> = JSON.parse(file);

		let result: vscode.CompletionItem[] = [];

		if (!snippets || typeof snippets !== 'object') {return [];}

		Object.entries(snippets).forEach(([key, value]) => {
			let { prefix, body, description = '' } = value;

			if (Array.isArray(body)) {body = body.join('\n');}

			if (typeof prefix === 'string') {
				let snippet = new vscode.CompletionItem(prefix);

				snippet.kind = vscode.CompletionItemKind.Snippet,
					snippet.detail = description || key,
					snippet.documentation = description || key,
					snippet.insertText = new vscode.SnippetString(body);

				result.push(snippet);
			}
		});

		return result;
	} catch (e) {
		console.error('parse snippets fail', e);

		vscode.window.showErrorMessage('parse snippets fail');
		return [];
	}

}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// const DEFAULT_CONFIG_NAME: string = 'snippets.code-snippets'

	// const sourceConfigPath: string = path.resolve(__dirname, DEFAULT_CONFIG_NAME)

	// parseSnippets(fs.readFileSync(sourceConfigPath, { encoding: 'utf-8' }))

	const folders = vscode.workspace.workspaceFolders || [];
	

	// .snippets.json has highest weight
	const configFiles: string[] = ['.snippets.js', '.snippets', '.snippets.json'];


	folders.forEach(folder => {
		configFiles.forEach(fileName => {
			const filePath: string = path.resolve(folder.uri.fsPath, fileName);
			// const snippetId: string = getFileName(fileName)
			const snippetId: string = 'all';

			let registerProvider = new RegisteredProvider();

			if (fs.existsSync(filePath)) {

				let customConfig: string = getJSONConfig(fileName, filePath);

				const snippet = parseSnippets(customConfig);

				_snippets[snippetId] = snippet;

				// if (_registeredProvider[snippetId]) {
				// 	_registeredProvider[snippetId].dispose()
				// }
				dispose();

				registerCompletionItemProvider(registerProvider);
				
			}

			const snippetsWatcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(filePath);

			function _wrapperListener(e: vscode.Uri) {
				// let snippetId: string = getFileName(e.fsPath)
				let snippetId: string = 'all';

				let config: string = getJSONConfig(path.basename(e.fsPath), e.fsPath);
				
				_snippets[snippetId] = parseSnippets(config);

				dispose();

				registerCompletionItemProvider(registerProvider);
				
			}

			snippetsWatcher.onDidCreate(_wrapperListener);
			snippetsWatcher.onDidChange(_wrapperListener);
			snippetsWatcher.onDidDelete((e: vscode.Uri) => dispose());
		});
	});

}

function getFileName(name: string): string {
	return path.basename(name).replace(/^(\.)(.+)$/, ($, $1, $2, $3) => $2).split('.')[0];
}

function registerCompletionItemProvider(registerProvider: vscode.CompletionItemProvider<vscode.CompletionItem>): void {
	languageType.forEach(language => {
		let dispose = vscode.languages.registerCompletionItemProvider(language, registerProvider);
		_registeredProvider[language] = dispose;
	});
}

function dispose(): void {
	languageType.forEach(language => {
		if (_registeredProvider[language]) {_registeredProvider[language].dispose();}
	});
}

function getJSONConfig(fileName: string, filePath: string): string {
	let config: string;
	if (fileName === '.snippets.js') {
		config = JSON.stringify(require(filePath));
	} else {
		config = fs.readFileSync(filePath, { encoding: 'utf-8' });
	}
	return config;
}


// This method is called when your extension is deactivated
export function deactivate() {
	dispose();
}

