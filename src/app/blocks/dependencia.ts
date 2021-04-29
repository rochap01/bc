import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class DependenciaBlock extends CustomBlock {

  constructor(type: string, block: any, blockMutator: BlockMutator, ...args: any[]) {
    super(type, block, blockMutator, ...args);
    this.class = DependenciaBlock;
  }

  defineBlock() {
    this.block.appendDummyInput()
      .appendField(this.args[1])
      .appendField(new Blockly.FieldDropdown([['Moderado', '2'], ['Fraco', '1'], ['Forte', '3']]), 'tipo');
    this.block.setPreviousStatement(true, null);
    this.block.setNextStatement(true, null);
    this.block.setColour(45);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  toXML() {
    return `<block type="dependencia${this.args[2]}" id="${this.args[2]}"></block>`;
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
  }

}
