import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class ConceitoBlock extends CustomBlock {

  constructor(type: string, block: any, blockMutator: BlockMutator, ...args: any[]) {
    super(type, block, blockMutator, ...args);
    this.class = ConceitoBlock;
  }

  defineBlock() {
    this.block.appendDummyInput()
      .appendField(this.args[1]);
    this.block.setPreviousStatement(true, null);
    this.block.setNextStatement(true, null);
    this.block.setColour(105);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  toXML() {
    return `<block type="conceito${this.args[2]}" id="${this.args[2]}"></block>`;
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
  }

}
