import {BlockMutator, CustomBlock} from 'ngx-blockly';

declare var Blockly: any;

export class EpisodioBlock extends CustomBlock {

  constructor(type: string, block: any, blockMutator: BlockMutator, ...args: any[]) {
    super(type, block, blockMutator, ...args);
    this.class = EpisodioBlock;
  }

  defineBlock() {
    this.block.appendStatementInput('ep_dependencia_area')
      .setCheck(null)
      .appendField('Dependências ->');
    this.block.appendStatementInput('ep_recurso_area')
      .setCheck(null)
      .appendField('Aulas ->');
    this.block.appendStatementInput('ep_avaliacao_area')
      .setCheck(null)
      .appendField('Avaliações ->');
    this.block.appendDummyInput()
      .appendField('Uniadade: ' + this.args[1]);
    this.block.setColour(230);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  toXML() {
    return `<block type="episodio${this.args[2]}" id="${this.args[2]}"></block>`;
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
  }

}
