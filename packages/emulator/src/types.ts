import { Register } from "@sohne/core";

/**
 * --------------------------------------------------------------------------
 * CPU Interface
 * --------------------------------------------------------------------------
 * Represents an abstract CPU interface with core emulation methods and
 * memory interaction capabilities.
 * @interface ICPU
 */
export interface ICPU {
  registers: CPUState;
  instState: EInstructionState;
  cycles: number;
  operandAddress: number;
  /**
   * Executes a single clock cycle of the CPU.
   * Advances the CPU's internal state and processes instructions.
   * @returns {void}
   */
  Tick(): void;

  /**
   * Resets the CPU to its initial state, clearing registers and flags.
   * @returns {void}
   */
  Reset(): void;

  /**
   * Loads a program into memory starting at the specified address.
   * Optionally, a default starting address can be used.
   * @param {number[]} program - The binary instructions to load into memory.
   * @param {number} [startAddress] - The address to begin loading (default: 0x0600).
   * @returns {void}
   */
  LoadProgram(program: number[], startAddress?: number): void;

  /**
   * Reads a byte of data from a specific memory address.
   * @param {number} address - The memory address to read from.
   * @returns {number} The byte of data at the specified address.
   */
  Read(address: number): number;

  /**
   * Writes a byte of data to a specific memory address.
   * @param {number} address - The memory address to write to.
   * @param {number} value - The byte of data to write.
   * @returns {void}
   */
  Write(address: number, value: number): void;

  /**
   * Pushes a byte of data onto the stack.
   * Decrements the stack pointer.
   * @param {number} value - The byte of data to push onto the stack.
   * @returns {void}
   */
  Push(value: number): void;

  /**
   * Pops a byte of data from the stack.
   * Increments the stack pointer.
   * @returns {number} The byte of data popped from the stack.
   */
  Pop(): number;
}

/**
 * --------------------------------------------------------------------------
 * Memory Interface
 * --------------------------------------------------------------------------
 * Represents an abstract memory interface with basic memory operations.
 * @interface Memory
 */
export interface IBus {

  /**
   * Resets the bus to its initial state.
   * @returns {void}
   */
  reset(): void;

  /**
   * Reads a value from a specific memory address.
   * @param {number} address - The memory address to read from.
   * @returns {number} The value stored at the specified address.
   */
  read(address: number): number;

  /**
   * Writes a value to a specific memory address.
   * @param {number} address - The memory address to write to.
   * @param {number} value - The value to be written to the address.
   */
  write(address: number, value: number): void;

  /**
   * Loads an array of data into memory starting from a specific address.
   * @param {number[]} data - An array of values to be loaded into memory.
   * @param {number} startAddress - The starting memory address for loading data.
   */
  load(data: number[], startAddress: number): void;

  /**
   * Dumps a range of memory values.
   * @param {number} startAddress - The starting memory address for the dump.
   * @param {number} length - The number of bytes to dump.
   * @returns {number[]} An array of values from the specified memory range.
   */
  dump(startAddress: number, length: number): number[];
}

/**
 * --------------------------------------------------------------------------
 * CPU State Type
 * --------------------------------------------------------------------------
 * Represents the state of a CPU, mapping registers to their current values.
 * Uses the Register type from @sohne/core to define the structure.
 * @type CPUState
 */
export type CPUState = Record<Register, number>;

/**
 * --------------------------------------------------------------------------
 * Instruction State Enumeration
 * --------------------------------------------------------------------------
 * Enumeration representing the different states of instruction processing.
 * @enum EInstructionState
 */
export enum EInstructionState {
  FETCH,
  DECODE,
  EXECUTE
}

