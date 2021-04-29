import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class AvaliacaoRecolhidoBlock extends CustomBlock {

  constructor(type: string, block: any, blockMutator: BlockMutator, ...args: any[]) {
    super(type, block, blockMutator, ...args);
    this.class = AvaliacaoRecolhidoBlock;
  }

  defineBlock() {
    this.block.appendDummyInput()
      .appendField(this.args[1])
      .appendField(new Blockly.FieldTextInput('1'), 'tempo_numero')
      .appendField(new Blockly.FieldDropdown([['dias', 'dia'], ['horas', 'hora'], ['minutos', 'minuto'], ['meses', 'mes']]), 'tempo');
    this.block.setPreviousStatement(true, null);
    this.block.setNextStatement(true, null);
    this.block.setColour(180);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  toXML() {
    return `<block type="avaliacao${this.args[2]}" id="${this.args[2]}"></block>`;
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
   // console.log('mudou');
  }

}
