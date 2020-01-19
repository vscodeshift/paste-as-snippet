// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import { expect } from 'chai'

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('extension.pasteAsSnippet command', async function() {
    const document = await vscode.workspace.openTextDocument(
      vscode.Uri.parse('untitled:test.json')
    )
    const editor = await vscode.window.showTextDocument(document)
    await editor.edit(edit =>
      edit.insert(
        document.positionAt(0),
        `{
  
}`
      )
    )
    editor.selection = new vscode.Selection(
      document.positionAt(4),
      document.positionAt(4)
    )
    vscode.env.clipboard.writeText('  this\n    is\n\n  a\n  test')
    await vscode.commands.executeCommand('extension.pasteAsSnippet')
    expect(document.getText()).to.equal(`{
  "": {
    "prefix": "",
    "body": [
      "this",
      "  is",
      "",
      "a",
      "test"
    ]
  }
}`)
    expect(editor.selection).to.deep.equal(
      new vscode.Selection(document.positionAt(5), document.positionAt(5))
    )
  })
})
