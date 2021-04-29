import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class RecursoBlock extends CustomBlock {

  constructor(type: string, block: any, blockMutator: BlockMutator, ...args: any[]) {
    super(type, block, blockMutator, ...args);
    this.class = RecursoBlock;
  }

  defineBlock() {

    this.block.appendDummyInput()
      .appendField(this.args[1]);
    this.block.appendStatementInput('espaco_conceitos')
      .setCheck(null)
      .appendField('Conceitos ->');
    this.block.appendStatementInput('espaco_dependencias')
      .setCheck(null)
      .appendField('Dependências ->');
    this.block.appendStatementInput('espaco_avaliacoes')
      .setCheck(null)
      .appendField('Avaliações ->');
    this.block.setPreviousStatement(true, null);
    this.block.setNextStatement(true, null);
    this.block.setColour(300);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  toXML() {
    return `<block type="recurso${this.args[2]}" id="${this.args[2]}"></block>`;
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
  }

}
