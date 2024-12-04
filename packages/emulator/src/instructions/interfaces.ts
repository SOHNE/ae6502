import { AddressingMode } from "@sohne/core";
import { ICPU } from "../types";

/**
 * Represents a single executable instruction command in the CPU.
 *
 * @interface InstructionCommand
 * @description Defines the contract for executing a specific CPU instruction.
 */
export interface InstructionCommand {
  /**
   * Executes the instruction on the given CPU.
   *
   * @param {ICPU} cpu - The CPU instance on which the instruction will be executed.
   * @returns {boolean} - Indicates whether the instruction execution is complete.
   *                      Returns true when the instruction has finished executing,
   *                      false if more cycles are needed to complete the instruction.
   *
   * @remarks
   * This method allows for complex instructions that may require multiple CPU cycles
   * to complete. By returning a boolean, it provides a mechanism for multi-cycle
   * instruction handling.
   *
   * @example
   * // A simple LDA (Load Accumulator) instruction implementation
   * {
   *   execute: (cpu: ICPU) => {
   *     cpu.registers.A = cpu.Read(cpu.operandAddress);
   *     return true; // Instruction completes in one cycle
   *   }
   * }
   */
  execute(cpu: ICPU): boolean;
}

/**
 * Defines the complete specification for a CPU instruction.
 *
 * @interface InstructionDefinition
 * @description Combines the executable command with its addressing mode.
 */
export interface InstructionDefinition {
  /**
   * The specific command to be executed for this instruction.
   *
   * @type {InstructionCommand}
   */
  command: InstructionCommand;

  /**
   * The addressing mode used by the instruction to determine
   * how the operand's memory address is calculated.
   *
   * @type {AddressingMode}
   *
   * @remarks
   * Addressing modes define how the instruction retrieves its operand,
   * which can vary based on different strategies like immediate,
   * zero page, absolute, indexed, etc.
   */
  mode: AddressingMode;
}
