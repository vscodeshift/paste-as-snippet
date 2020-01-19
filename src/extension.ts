import * as vscode from 'vscode'
import dedent from './dedent'

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'extension.pasteAsSnippet',
    async (): Promise<void> => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      const clipboard = await vscode.env.clipboard.readText()
      if (!/\S/.test(clipboard)) return
      const code = dedent(clipboard)

      let snippet = `"": ${JSON.stringify(
        {
          prefix: '',
          body: code.split(/\r\n?|\n/gm),
        },
        null,
        2
      )}`

      const selLine = editor.document.lineAt(editor.selection.start.line).text
      const selectionIndent = selLine.substring(
        0,
        editor.selection.start.character
      )
      if (selectionIndent && !/\S/.test(selectionIndent)) {
        snippet = snippet.replace(/^/gm, selectionIndent).trim()
      }

      const insertOffset = editor.document.offsetAt(editor.selection.start)
      await editor.edit(edit => edit.replace(editor.selection, snippet))
      const newPosition = editor.document.positionAt(insertOffset + 1)
      editor.selection = new vscode.Selection(newPosition, newPosition)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
