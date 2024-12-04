import { CPUState, IBus, ICPU, EInstructionState } from "./types";
import { InstructionSet, InstructionDefinition } from "./instructions";
import Memory from "./bus";
import { AddressingModeFlyweightFactory } from "./addressingModes";

export class MOS6502 implements ICPU {
  public registers: CPUState = {
    A: 0,
    X: 0,
    Y: 0,
    SP: 0xFF,
    PC: 0x0000,
    P: 0x20
  };

  /**
   * Memory bus initialized with 64KB of addressable memory
   * Represents the entire memory space of the emulated system
   */
  private memory: IBus = new Memory(64 * 1024);

  // CPU State Management
  public instState = EInstructionState.FETCH;
  public cycles: number = 0;

  private currInstruction: InstructionDefinition | null = null;
  public operandAddress: number = 0;

  private instructionSet: InstructionSet = InstructionSet.getInstance();

  /**
   * Resets the emulator to its initial state
   * - Clears all registers to their default values
   * - Reinitializes memory
   */
  public Reset(): void {
    this.registers = {
      A: 0,
      X: 0,
      Y: 0,
      SP: 0xFF,
      PC: 0x0000,
      P: 0x20,
    };

    this.memory.reset();
  }

  /**
   * Executes a single clock cycle of the CPU
   * Manages the instruction processing state machine
   *
   * The CPU operates in three primary states:
   * 1. FETCH: Retrieves the next instruction from memory
   * 2. DECODE: Interprets the instruction's operation and addressing mode
   * 3. EXECUTE: Performs the actual instruction operation
   *
   * @remarks
   * This method is typically called repeatedly to simulate CPU clock cycles
   * Each call advances the instruction processing to the next state
   *
   * @throws {Error} Potential errors during instruction processing (not implemented yet)
   */
  public Tick(): void {
    switch (this.instState) {
      case EInstructionState.FETCH:
        this.FetchCycle();
        break;
      case EInstructionState.DECODE:
        this.DecodeCycle();
        break;
      case EInstructionState.EXECUTE:
        this.ExecuteCycle();
        break;
    }
  }

  /**
   * Fetches the next instruction from memory
   * Updates the program counter (PC) to point to the next instruction
   *
   * @remarks
   * The fetch cycle involves reading the instruction at the address specified
   * by the program counter, then incrementing the program counter to prepare
   * for the next instruction fetch in the subsequent cycle.
   */
  private FetchCycle(): void {
    // Read the next opcode and increment program counter
    const opcode = this.Read(this.registers.PC++);
    this.currInstruction = this.instructionSet.getInstruction(opcode)!;

    if (!this.currInstruction) {
      throw new Error(`Unknown opcode: $${opcode.toString(16).toUpperCase()}`);
    }

    // Move to decode state
    this.cycles = 0;
    this.instState = EInstructionState.DECODE;
  }

  /**
   * Decodes the fetched instruction
   * Determines the operation type and addressing mode
   *
   * @remarks
   * The decode cycle interprets the instruction and prepares the necessary
   * data for execution. This includes identifying the operation to be performed
   * and any operands required.
   */
  private DecodeCycle(): void {
    if (!this.currInstruction) return;

    // Use the Flyweight factory to resolve the addressing mode
    {
      const address = AddressingModeFlyweightFactory.resolve(
        this.currInstruction.mode,
        this
      );

      if (address === null) {
        ++this.cycles;
        return;
      }

      this.operandAddress = address;
    }

    this.cycles = 0;
    this.instState = EInstructionState.EXECUTE;
  }

  /**
   * Executes the decoded instruction
   * Performs the operation defined by the instruction
   *
   * @remarks
   * The execute cycle carries out the instruction's operation, which may involve
   * reading from or writing to memory, manipulating registers, or performing
   * arithmetic or logical operations.
   */
  private ExecuteCycle(): void {
    if (!this.currInstruction) return;

    if (!this.currInstruction.command.execute(this)) {
      ++this.cycles;
      return;
    }

    // Instruction is complete
    this.instState = EInstructionState.FETCH;
  }

  /**
   * Reads a byte from the specified memory address
   *
   * @param {number} address - Memory address to read from
   * @returns {number} The byte value at the given address
   */
  public Read(address: number): number {
    return this.memory.read(address);
  }

  /**
   * Writes a byte to the specified memory address
   *
   * @param {number} address - Memory address to write to
   * @param {number} value - Byte value to write
   */
  public Write(address: number, value: number): void {
    this.memory.write(address, value);
  }

  /**
   * Loads a program into memory and sets the program counter
   * Default load address is 0x600 (standard load address for 6502 programs)
   *
   * @param {number[]} program - Array of bytes to load
   * @param {number} [startAddress=0x600] - Memory address to load the program
   */
  public LoadProgram(program: number[], startAddress: number = 0x600): void {
    this.memory.load(program, startAddress);
    this.registers.PC = startAddress;
  }

  /**
   * Pushes a byte value onto the stack
   *
   * @param {number} value - Value to push onto the stack
   */
  public Push(value: number): void {
    this.Write(0x100 + (this.registers.SP & 0xFF), value);
    this.registers.SP = (this.registers.SP - 1) & 0xFF;
  }

  /**
   * Pops a byte value from the stack
   *
   * @returns {number} The byte value popped from the stack
   */
  public Pop(): number {
    this.registers.SP = (this.registers.SP + 1) & 0xFF;
    return this.Read(0x100 + this.registers.SP);
  }
}
