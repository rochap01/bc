import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class TestBlock extends CustomBlock {
  constructor(type: string, block: any, blockMutator: BlockMutator) {
    super(type, block, blockMutator);
    this.class = TestBlock;
  }

  defineBlock() {
    this.block.appendValueInput('NAME')
      .setCheck(null)
      .appendField('teste');
    this.block.setOutput(true, 'Input');
    this.block.setColour(230);
    this.block.setTooltip('');
    this.block.setHelpUrl('');

    /*
     this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("teste");
    this.setColour(230);
    * */
  }

  toXML() {
    return '<block type="test"></block>';
  }

  onChange(changeEvent: any) {
    console.log(changeEvent);
  }

}
