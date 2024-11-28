/**
 * Represents the characteristics of an addressing mode in the CPU instruction set.
 *
 * @interface InstructionAddressing
 * @property {number} size - The size of the addressing mode in bytes.
 * @property {number} cycles - The number of clock cycles required when using this addressing mode.
 */
export interface InstructionAddressing {
  size: number;   // Size in bytes
  cycles: number; // Number of cycles
}

/**
 * Represents an instruction for a CPU.
 *
 * @interface Instruction
 * @property {number} opcode - The unique opcode that represents the instruction.
 * @property {number} cycles - The number of clock cycles required to execute the instruction.
 * @property {InstructionAddressing} addressingMode - The addressing mode used by the instruction.
 */
export interface Instruction {
  opcode: number;
  cycles: number;
  addressingMode: InstructionAddressing;
}

/**
 * A collection of predefined addressing modes used in 6502 instructions.
 * Each addressing mode has a defined size and the number of cycles it takes to execute.
 *
 * @constant ADDRESSING_MODES
 * @type {Record<string, InstructionAddressing>}
 */
export const ADDRESSING_MODES: Record<string, InstructionAddressing> = {
  /**
   * IMPLICIT ADDRESSING
   * No operands needed. The source and destination are implied by the instruction.
   * Instructions like CLC (Clear Carry) or RTS (Return from Subroutine) use this mode.
   */
  IMPLIED: { size: 1, cycles: 2 },

  /**
   * IMMEDIATE ADDRESSING
   * Operand is a direct 8-bit constant specified in the instruction.
   * Indicated by '#' symbol, e.g., LDA #10 loads the value 10 into the accumulator.
   */
  IMMEDIATE: { size: 2, cycles: 2 },

  /**
   * ACCUMULATOR ADDRESSING
   * Operation is performed directly on the accumulator.
   * Specified by using 'A' as the operand, e.g., LSR A (Logical Shift Right Accumulator).
   */
  ACCUMULATOR: { size: 1, cycles: 2 },

  /**
   * ZERO PAGE ADDRESSING
   * Addresses only the first 256 bytes of memory (0x0000 to 0x00FF).
   * Uses only the least significant byte of the address, making instructions shorter.
   */
  ZERO_PAGE: { size: 2, cycles: 3 },

  /**
   * ZERO PAGE, X-INDEXED ADDRESSING
   * Zero page address is calculated by adding the X register.
   * Address wraps around within the zero page if it exceeds 0xFF.
   */
  ZERO_PAGE_X: { size: 2, cycles: 4 },

  /**
   * ZERO PAGE, Y-INDEXED ADDRESSING
   * Zero page address is calculated by adding the Y register.
   * Typically used only with LDX and STX instructions.
   */
  ZERO_PAGE_Y: { size: 2, cycles: 4 },

  /**
   * ABSOLUTE ADDRESSING
   * Uses a full 16-bit address to specify the memory location.
   * Provides access to the entire 64KB memory space.
   */
  ABSOLUTE: { size: 3, cycles: 4 },

  /**
   * ABSOLUTE, X-INDEXED ADDRESSING
   * 16-bit address is calculated by adding the X register.
   * Used for indexed access to memory locations.
   */
  ABSOLUTE_X: { size: 3, cycles: 4 },

  /**
   * ABSOLUTE, Y-INDEXED ADDRESSING
   * 16-bit address is calculated by adding the Y register.
   * Used for indexed access to memory locations.
   */
  ABSOLUTE_Y: { size: 3, cycles: 4 },

  /**
   * INDIRECT ADDRESSING
   * Only used by JMP instruction.
   * 16-bit address points to another 16-bit address which is the actual target.
   */
  INDIRECT: { size: 3, cycles: 5 },

  /**
   * RELATIVE ADDRESSING
   * Used by branch instructions.
   * Contains a signed 8-bit offset added to the program counter if the condition is true.
   */
  RELATIVE: { size: 2, cycles: 2 },

  /**
   * INDEXED INDIRECT ADDRESSING
   * Used with a zero-page table of addresses.
   * X register is added to the instruction's address to find the target address.
   */
  INDEXED_INDIRECT: { size: 2, cycles: 6 },

  /**
   * INDIRECT INDEXED ADDRESSING
   * Zero-page location contains the least significant byte of a 16-bit address.
   * Y register is added to generate the final target address.
   */
  INDIRECT_INDEXED: { size: 2, cycles: 5 },
};

/**
 * A collection of instructions available in the CPU instruction set.
 * Each instruction has a unique opcode, the number of cycles required to execute,
 * and the addressing mode it uses.
 *
 * @constant INSTRUCTION_SET
 * @type {Record<string, Instruction>}
 */
export const INSTRUCTION_SET: Record<string, Instruction> = {
  /** LOAD INSTRUCTIONS */
  LDA: { opcode: 0xA9, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE }, // Load Accumulator

  /** STORE INSTRUCTIONS */
  STA: { opcode: 0x85, cycles: 3, addressingMode: ADDRESSING_MODES.ZERO_PAGE },   // Store Accumulator
  STX: { opcode: 0x86, cycles: 3, addressingMode: ADDRESSING_MODES.ZERO_PAGE },   // Store X Register
  STY: { opcode: 0x84, cycles: 3, addressingMode: ADDRESSING_MODES.ZERO_PAGE },   // Store Y Register

  /** ARITHMETIC INSTRUCTIONS */
  ADC: { opcode: 0x69, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Add with Carry
  SBC: { opcode: 0xE9, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Subtract with Carry

  /** LOGICAL INSTRUCTIONS */
  LSR: { opcode: 0x4A, cycles: 2, addressingMode: ADDRESSING_MODES.ACCUMULATOR }, // Logical Shift Right

  /** BITWISE INSTRUCTIONS */
  AND: { opcode: 0x29, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Bitwise AND
  ORA: { opcode: 0x09, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Bitwise OR
  EOR: { opcode: 0x49, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Bitwise XOR

  /** CONTROL INSTRUCTIONS */
  JMP: { opcode: 0x4C, cycles: 3, addressingMode: ADDRESSING_MODES.ABSOLUTE },    // Jump to Subroutine
  RTS: { opcode: 0x60, cycles: 6, addressingMode: ADDRESSING_MODES.IMPLIED },     // Return from Subroutine
  BRK: { opcode: 0x00, cycles: 7, addressingMode: ADDRESSING_MODES.IMPLIED },     // Force Break

  /** COMPARISON INSTRUCTIONS */
  CMP: { opcode: 0xC9, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Compare Accumulator
  CPX: { opcode: 0xE0, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Compare X Register
  CPY: { opcode: 0xC0, cycles: 2, addressingMode: ADDRESSING_MODES.IMMEDIATE },   // Compare Y Register
};

/**
 * A type representing the names of the registers in the CPU.
 *
 * @type Register
 * @type {"A" | "X" | "Y" | "SP" | "PC" | "P"}
 */
export type Register = "A" | "X" | "Y" | "SP" | "PC" | "P";

/**
 * An array of register names used in the CPU.
 *
 * @constant REGISTER_NAMES
 * @type {Register[]}
 */
export const REGISTER_NAMES: Register[] = ["A", "X", "Y", "SP", "PC", "P"];
