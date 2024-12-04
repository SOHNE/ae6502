import { InstructionDefinition } from "./interfaces";
import * as op from "./opcodes";

export { InstructionDefinition };

export class InstructionSet {
  private static instance: InstructionSet;
  private instructions: Map<number, InstructionDefinition>;

  private constructor() {
    this.instructions = new Map();
    this.initializeInstructions();
  }

  static getInstance(): InstructionSet {
    if (!InstructionSet.instance) {
      InstructionSet.instance = new InstructionSet();
    }
    return InstructionSet.instance;
  }

  private initializeInstructions(): void {
    const instructionsData: Array<[number, InstructionDefinition]> = [
      /** LOAD OPERATIONS */
      [0xA9, { command: op.LDA.getInstance("LDA"), mode: "IMMEDIATE" }],
      [0xA5, { command: op.LDA.getInstance("LDA"), mode: "ZERO_PAGE" }],
      [0xB5, { command: op.LDA.getInstance("LDA"), mode: "ZERO_PAGE_X" }],
      [0xAD, { command: op.LDA.getInstance("LDA"), mode: "ABSOLUTE" }],
      [0xBD, { command: op.LDA.getInstance("LDA"), mode: "ABSOLUTE_X" }],
      [0xB9, { command: op.LDA.getInstance("LDA"), mode: "ABSOLUTE_Y" }],
      [0xA1, { command: op.LDA.getInstance("LDA"), mode: "INDEXED_INDIRECT" }],
      [0xB1, { command: op.LDA.getInstance("LDA"), mode: "INDIRECT_INDEXED" }],

      [0xA2, { command: op.LDX.getInstance("LDX"), mode: "IMMEDIATE" }],
      [0xA6, { command: op.LDX.getInstance("LDX"), mode: "ZERO_PAGE" }],
      [0xB6, { command: op.LDX.getInstance("LDX"), mode: "ZERO_PAGE_Y" }],
      [0xAE, { command: op.LDX.getInstance("LDX"), mode: "ABSOLUTE" }],
      [0xBE, { command: op.LDX.getInstance("LDX"), mode: "ABSOLUTE_Y" }],

      // [0xA0, { command: op.LDY.getInstance("LDY"), mode: "IMMEDIATE" }],
      // [0xA4, { command: op.LDY.getInstance("LDY"), mode: "ZERO_PAGE" }],
      // [0xB4, { command: op.LDY.getInstance("LDY"), mode: "ZERO_PAGE_X" }],
      // [0xAC, { command: op.LDY.getInstance("LDY"), mode: "ABSOLUTE" }],
      // [0xBC, { command: op.LDY.getInstance("LDY"), mode: "ABSOLUTE_X" }],

      /** STORE OPERATIONS */
      [0x85, { command: op.STA.getInstance("STA"), mode: "ZERO_PAGE" }],
      [0x95, { command: op.STA.getInstance("STA"), mode: "ZERO_PAGE_X" }],
      [0x8D, { command: op.STA.getInstance("STA"), mode: "ABSOLUTE" }],
      [0x9D, { command: op.STA.getInstance("STA"), mode: "ABSOLUTE_X" }],
      [0x99, { command: op.STA.getInstance("STA"), mode: "ABSOLUTE_Y" }],
      [0x81, { command: op.STA.getInstance("STA"), mode: "INDEXED_INDIRECT" }],
      [0x91, { command: op.STA.getInstance("STA"), mode: "INDIRECT_INDEXED" }],

      // [0x86, { command: op.STX.getInstance("STX"), mode: "ZERO_PAGE" }],
      // [0x96, { command: op.STX.getInstance("STX"), mode: "ZERO_PAGE_Y" }],
      // [0x8E, { command: op.STX.getInstance("STX"), mode: "ABSOLUTE" }],

      // [0x84, { command: op.STY.getInstance("STY"), mode: "ZERO_PAGE" }],
      // [0x94, { command: op.STY.getInstance("STY"), mode: "ZERO_PAGE_X" }],
      // [0x8C, { command: op.STY.getInstance("STY"), mode: "ABSOLUTE" }],

      /** TRANSFER OPERATIONS */
      // [0xAA, { command: op.TAX.getInstance("TAX"), mode: "IMPLIED" }],
      // [0xA8, { command: op.TAY.getInstance("TAY"), mode: "IMPLIED" }],
      // [0xBA, { command: op.TSX.getInstance("TSX"), mode: "IMPLIED" }],
      // [0x8A, { command: op.TXA.getInstance("TXA"), mode: "IMPLIED" }],
      // [0x9A, { command: op.TXS.getInstance("TXS"), mode: "IMPLIED" }],
      // [0x98, { command: op.TYA.getInstance("TYA"), mode: "IMPLIED" }],

      /** ARITHMETIC OPERATIONS */
      /*[0x69, { command: op.ADC.getInstance("ADC"), mode: "IMMEDIATE" }],*/
      /*[0x65, { command: op.ADC.getInstance("ADC"), mode: "ZERO_PAGE" }],*/
      /*[0x75, { command: op.ADC.getInstance("ADC"), mode: "ZERO_PAGE_X" }],*/
      /*[0x6D, { command: op.ADC.getInstance("ADC"), mode: "ABSOLUTE" }],*/
      /*[0x7D, { command: op.ADC.getInstance("ADC"), mode: "ABSOLUTE_X" }],*/
      /*[0x79, { command: op.ADC.getInstance("ADC"), mode: "ABSOLUTE_Y" }],*/
      /*[0x61, { command: op.ADC.getInstance("ADC"), mode: "INDEXED_INDIRECT" }],*/
      /*[0x71, { command: op.ADC.getInstance("ADC"), mode: "INDIRECT_INDEXED" }],*/

      /*[0xE9, { command: op.SBC.getInstance("SBC"), mode: "IMMEDIATE" }],*/
      /*[0xE5, { command: op.SBC.getInstance("SBC"), mode: "ZERO_PAGE" }],*/
      /*[0xF5, { command: op.SBC.getInstance("SBC"), mode: "ZERO_PAGE_X" }],*/
      /*[0xED, { command: op.SBC.getInstance("SBC"), mode: "ABSOLUTE" }],*/
      /*[0xFD, { command: op.SBC.getInstance("SBC"), mode: "ABSOLUTE_X" }],*/
      /*[0xF9, { command: op.SBC.getInstance("SBC"), mode: "ABSOLUTE_Y" }],*/
      /*[0xE1, { command: op.SBC.getInstance("SBC"), mode: "INDEXED_INDIRECT" }],*/
      /*[0xF1, { command: op.SBC.getInstance("SBC"), mode: "INDIRECT_INDEXED" }],*/

      /** LOGICAL OPERATIONS */
      /*[0x29, { command: op.AND.getInstance("AND"), mode: "IMMEDIATE" }],*/
      /*[0x25, { command: op.AND.getInstance("AND"), mode: "ZERO_PAGE" }],*/
      /*[0x35, { command: op.AND.getInstance("AND"), mode: "ZERO_PAGE_X" }],*/
      /*[0x2D, { command: op.AND.getInstance("AND"), mode: "ABSOLUTE" }],*/
      /*[0x3D, { command: op.AND.getInstance("AND"), mode: "ABSOLUTE_X" }],*/
      /*[0x39, { command: op.AND.getInstance("AND"), mode: "ABSOLUTE_Y" }],*/
      /*[0x21, { command: op.AND.getInstance("AND"), mode: "INDEXED_INDIRECT" }],*/
      /*[0x31, { command: op.AND.getInstance("AND"), mode: "INDIRECT_INDEXED" }],*/

      /*[0x09, { command: op.ORA.getInstance("ORA"), mode: "IMMEDIATE" }],*/
      /*[0x05, { command: op.ORA.getInstance("ORA"), mode: "ZERO_PAGE" }],*/
      /*[0x15, { command: op.ORA.getInstance("ORA"), mode: "ZERO_PAGE_X" }],*/
      /*[0x0D, { command: op.ORA.getInstance("ORA"), mode: "ABSOLUTE" }],*/
      /*[0x1D, { command: op.ORA.getInstance("ORA"), mode: "ABSOLUTE_X" }],*/
      /*[0x19, { command: op.ORA.getInstance("ORA"), mode: "ABSOLUTE_Y" }],*/
      /*[0x01, { command: op.ORA.getInstance("ORA"), mode: "INDEXED_INDIRECT" }],*/
      /*[0x11, { command: op.ORA.getInstance("ORA"), mode: "INDIRECT_INDEXED" }],*/

      /*[0x49, { command: op.EOR.getInstance("EOR"), mode: "IMMEDIATE" }],*/
      /*[0x45, { command: op.EOR.getInstance("EOR"), mode: "ZERO_PAGE" }],*/
      /*[0x55, { command: op.EOR.getInstance("EOR"), mode: "ZERO_PAGE_X" }],*/
      /*[0x4D, { command: op.EOR.getInstance("EOR"), mode: "ABSOLUTE" }],*/
      /*[0x5D, { command: op.EOR.getInstance("EOR"), mode: "ABSOLUTE_X" }],*/
      /*[0x59, { command: op.EOR.getInstance("EOR"), mode: "ABSOLUTE_Y" }],*/
      /*[0x41, { command: op.EOR.getInstance("EOR"), mode: "INDEXED_INDIRECT" }],*/
      /*[0x51, { command: op.EOR.getInstance("EOR"), mode: "INDIRECT_INDEXED" }],*/

      /** COMPARISON OPERATIONS */
      /*[0xC9, { command: op.CMP.getInstance("CMP"), mode: "IMMEDIATE" }],*/
      /*[0xC5, { command: op.CMP.getInstance("CMP"), mode: "ZERO_PAGE" }],*/
      /*[0xD5, { command: op.CMP.getInstance("CMP"), mode: "ZERO_PAGE_X" }],*/
      /*[0xCD, { command: op.CMP.getInstance("CMP"), mode: "ABSOLUTE" }],*/
      /*[0xDD, { command: op.CMP.getInstance("CMP"), mode: "ABSOLUTE_X" }],*/
      /*[0xD9, { command: op.CMP.getInstance("CMP"), mode: "ABSOLUTE_Y" }],*/
      /*[0xC1, { command: op.CMP.getInstance("CMP"), mode: "INDEXED_INDIRECT" }],*/
      /*[0xD1, { command: op.CMP.getInstance("CMP"), mode: "INDIRECT_INDEXED" }],*/

      /*[0xE0, { command: op.CPX.getInstance("CPX"), mode: "IMMEDIATE" }],*/
      /*[0xE4, { command: op.CPX.getInstance("CPX"), mode: "ZERO_PAGE" }],*/
      /*[0xEC, { command: op.CPX.getInstance("CPX"), mode: "ABSOLUTE" }],*/

      /*[0xC0, { command: op.CPY.getInstance("CPY"), mode: "IMMEDIATE" }],*/
      /*[0xC4, { command: op.CPY.getInstance("CPY"), mode: "ZERO_PAGE" }],*/
      /*[0xCC, { command: op.CPY.getInstance("CPY"), mode: "ABSOLUTE" }],*/

      /** INCREMENT/DECREMENT OPERATIONS */
      /*[0xE6, { command: op.INC.getInstance("INC"), mode: "ZERO_PAGE" }],*/
      /*[0xF6, { command: op.INC.getInstance("INC"), mode: "ZERO_PAGE_X" }],*/
      /*[0xEE, { command: op.INC.getInstance("INC"), mode: "ABSOLUTE" }],*/
      /*[0xFE, { command: op.INC.getInstance("INC"), mode: "ABSOLUTE_X" }],*/

      // [0xE8, { command: op.INX.getInstance("INX"), mode: "IMPLIED" }],

      // [0xC8, { command: op.INY.getInstance("INY"), mode: "IMPLIED" }],

      /*[0xC6, { command: op.DEC.getInstance("DEC"), mode: "ZERO_PAGE" }],*/
      /*[0xD6, { command: op.DEC.getInstance("DEC"), mode: "ZERO_PAGE_X" }],*/
      /*[0xCE, { command: op.DEC.getInstance("DEC"), mode: "ABSOLUTE" }],*/
      /*[0xDE, { command: op.DEC.getInstance("DEC"), mode: "ABSOLUTE_X" }],*/

      // [0xCA, { command: op.DEX.getInstance("DEX"), mode: "IMPLIED" }],

      // [0x88, { command: op.DEY.getInstance("DEY"), mode: "IMPLIED" }],

      /** BIT OPERATIONS */
      /*[0x24, { command: op.BIT.getInstance("BIT"), mode: "ZERO_PAGE" }],*/
      /*[0x2C, { command: op.BIT.getInstance("BIT"), mode: "ABSOLUTE" }],*/

      /** JUMP OPERATIONS */
      /*[0x4C, { command: op.JMP.getInstance("JMP"), mode: "ABSOLUTE" }],*/
      /*[0x6C, { command: op.JMP.getInstance("JMP"), mode: "INDIRECT" }],*/
      /*[0x20, { command: op.JSR.getInstance("JSR"), mode: "ABSOLUTE" }],*/
      /*[0x60, { command: op.RTS.getInstance("RTS"), mode: "IMPLIED" }],*/

      /** CONTROL OPERATIONS */
      [0x00, { command: op.BRK.getInstance("BRK"), mode: "IMPLIED" }],
      /*[0x40, { command: op.RTI.getInstance("RTI"), mode: "IMPLIED" }],*/

      /** FLAG OPERATIONS */
      /*[0x18, { command: op.CLC.getInstance("CLC"), mode: "IMPLIED" }],*/
      /*[0xD8, { command: op.CLD.getInstance("CLD"), mode: "IMPLIED" }],*/
      /*[0x58, { command: op.CLI.getInstance("CLI"), mode: "IMPLIED" }],*/
      /*[0xB8, { command: op.CLV.getInstance("CLV"), mode: "IMPLIED" }],*/
      /*[0x38, { command: op.SEC.getInstance("SEC"), mode: "IMPLIED" }],*/
      /*[0xF8, { command: op.SED.getInstance("SED"), mode: "IMPLIED" }],*/
      /*[0x78, { command: op.SEI.getInstance("SEI"), mode: "IMPLIED" }],*/
    ];

    // Initialize the instructions map
    this.instructions = new Map(instructionsData);
  }

  // Emulator methods
  getInstruction(opcode: number): InstructionDefinition | undefined {
    return this.instructions.get(opcode);
  }
}
