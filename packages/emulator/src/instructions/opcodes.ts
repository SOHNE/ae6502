import { ICPU } from "../types";
import { InstructionCommand } from "./interfaces";

/* -------------------------------------- Instruction Implementation ------------------------------------------------------- */
class BaseInstruction implements InstructionCommand {
  protected static instances: Map<string, BaseInstruction> = new Map();

  static getInstance(key: string): BaseInstruction {
    if (!this.instances.has(key)) {
      this.instances.set(key, new this());
    }
    return this.instances.get(key)!;
  }

  execute(_cpu: ICPU): boolean {
    throw new Error("Execute method not implemented");
  }

  protected updateNZ(cpu: ICPU, value: number): void {
    // Clear the Negative (0x80) and Zero (0x02) flags
    cpu.registers.P &= ~0x82;

    // Set the Negative flag if bit 7 is set and the Zero flag if the value is zero
    cpu.registers.P |= (value & 0x80) | ((value & 0xFF) === 0 ? 0x02 : 0);
  }
}

/* -------------------------------------- LDA Command ------------------------------------------------------- */
// Instruction: Load The Accumulator (LDA)
// Function:    A = M
// Description: Loads a value from memory (address) into the accumulator register (A).
// Flags Out:   N (Negative), Z (Zero)
export class LDA extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.A = cpu.Read(cpu.operandAddress);
    super.updateNZ(cpu, cpu.registers.A);
    return true;
  }
}

/* -------------------------------------- LDX Command ------------------------------------------------------- */
// Instruction: Load X Register (LDX)
// Function:    X = M
// Description: Loads a value from memory (address) into the X index register.
// Flags Out:   N (Negative), Z (Zero)
export class LDX extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.X = cpu.Read(cpu.operandAddress);
    super.updateNZ(cpu, cpu.registers.X);
    return true;
  }
}

/* -------------------------------------- LDY Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#LDY
// Instruction: Load Y Register (LDY)
// Function:    Y = M
// Description: Loads a value from memory (address) into the Y index register.
// Flags Out:   N (Negative), Z (Zero)
export class LDY extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.Y = cpu.Read(cpu.operandAddress);
    super.updateNZ(cpu, cpu.registers.Y);
    return true;
  }
}

/* -------------------------------------- STA Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#STA
// Instruction: Store Accumulator (STA)
// Function:    M = A
// Description: Stores the value from the accumulator register (A) into memory at the specified address.
// Flags Out:   None
export class STA extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.Write(cpu.operandAddress, cpu.registers.A);
    return true;
  }
}

/* -------------------------------------- STX Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#STX
// Instruction: Store X Register (STX)
// Function:    M = X
// Description: Stores the value from the X register into memory at the specified address.
// Flags Out:   None
export class STX extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.Write(cpu.operandAddress, cpu.registers.X);
    return true;
  }
}

/* -------------------------------------- STY Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#STY
// Instruction: Store X Register (STY)
// Function:    M = Y
// Description: Stores the value from the Y register into memory at the specified address.
// Flags Out:   None
export class STY extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.Write(cpu.operandAddress, cpu.registers.Y);
    return true;
  }
}

/* -------------------------------------- TAX Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TAX
// Instruction: Transfer A to X
// Function:    X = A
// Description: Transfers the value from the Accumulator to the X register
// Flags Out:   N, Z
export class TAX extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.X = cpu.registers.A;
    super.updateNZ(cpu, cpu.registers.X);
    return true;
  }
}

/* -------------------------------------- TAY Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TAY
// Instruction: Transfer A to Y
// Function:    Y = A
// Description: Transfers the value from the Accumulator to the Y register
// Flags Out:   N, Z
export class TAY extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.Y = cpu.registers.A;
    super.updateNZ(cpu, cpu.registers.Y);
    return true;
  }
}

/* -------------------------------------- TSX Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TSX
// Instruction: Transfer Stack Pointer to X
// Function:    X = SP
// Description: Transfers the value from the Stack Pointer to the X register
// Flags Out:   N, Z
export class TSX extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.X = cpu.registers.SP;
    super.updateNZ(cpu, cpu.registers.X);
    return true;
  }
}

/* -------------------------------------- TXA Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TXA
// Instruction: Transfer X to A
// Function:    A = X
// Description: Transfers the value from the X register to the Accumulator
// Flags Out:   N, Z
export class TXA extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.A = cpu.registers.X;
    super.updateNZ(cpu, cpu.registers.A);
    return true;
  }
}

/* -------------------------------------- TXS Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TXS
// Instruction: Transfer X to Stack Pointer
// Function:    SP = X
// Description: Transfers the value from the X register to the Stack Pointer
// Flags Out:   None
export class TXS extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.SP = cpu.registers.X;
    return true;
  }
}

/* -------------------------------------- TYA Command ------------------------------------------------------- */
// https://www.masswerk.at/6502/6502_instruction_set.html#TYA
// Instruction: Transfer Y to A
// Function:    A = Y
// Description: Transfers the value from the Y register to the Accumulator
// Flags Out:   N, Z
export class TYA extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    cpu.registers.A = cpu.registers.Y;
    super.updateNZ(cpu, cpu.registers.A);
    return true;
  }
}

/* -------------------------------------- BRK Command ------------------------------------------------------- */
// Instruction: Break (BRK)
// Function:    Interrupt
// Description: Triggers a software interrupt. It saves the current program counter (PC+2) and processor status
//              onto the stack. Does NOT automatically disable interrupts.
// Flags Out:   B (Break) is set when pushed to stack
export class BRK extends BaseInstruction {
  execute(cpu: ICPU): boolean {
    switch (cpu.cycles) {
      case 1:
        // Increment PC to skip the break mark (PC+2)
        cpu.registers.PC++;
        break;

      case 2:
        // Set Break flag
        cpu.registers.P |= 0x10; // Set Break flag
        break;

      case 3:
        // Push PCH of PC+2 onto stack
        cpu.Push((cpu.registers.PC >> 8) & 0xFF);
        break;

      case 4:
        // Push PCL of PC+2 onto stack
        cpu.Push(cpu.registers.PC & 0xFF);
        break;

      case 5:
        // Push processor status onto stack with Break flag set
        cpu.Push(cpu.registers.P);
        break;

      case 6:
        // Sixth cycle: Fetch PCL from interrupt vector
        cpu.registers.PC = cpu.Read(0xFFFE);
        break;

      case 7:
        // Seventh cycle: Fetch PCH from interrupt vector
        cpu.registers.PC |= cpu.Read(0xFFFF) << 8;
        return true;
    }

    return false;
  }
}
