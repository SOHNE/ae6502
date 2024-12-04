import { ICPU } from "./types";
import { AddressingMode } from "@sohne/core";

// Flyweight State
class SharedAddressingState {
  lowByte = 0;
  highByte = 0;
  indirectLowByte = 0;
  indirectHighByte = 0;
  zeroPageLowByte = 0;
  pageCrossed = false;

  reset(): void {
    this.lowByte = 0;
    this.highByte = 0;
    this.indirectLowByte = 0;
    this.indirectHighByte = 0;
    this.zeroPageLowByte = 0;
    this.pageCrossed = false;
  }

  calculateAddress(base: number, offset: number): number {
    const fullAddress = base + offset;
    this.pageCrossed = (base & 0xFF00) !== (fullAddress & 0xFF00);
    return fullAddress & 0xFFFF;
  }
}

// Strategy Interface
interface AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null;
}

// Concrete Strategies
class ImpliedAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, _sharedState: SharedAddressingState): number {
    return cpu.registers.PC;
  }
}

class ImmediateAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, _sharedState: SharedAddressingState): number {
    return cpu.registers.PC++;
  }
}

class AbsoluteAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.lowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1: {
        sharedState.highByte = cpu.Read(cpu.registers.PC++);
        const absoluteAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        return absoluteAddress;
      }
    }
    return null;
  }
}

class AbsoluteXAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.lowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1: {
        sharedState.highByte = cpu.Read(cpu.registers.PC++);
        const initialBaseAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        const addressWithOffset = sharedState.calculateAddress(initialBaseAddress, cpu.registers.X);

        if (!sharedState.pageCrossed) {
          return addressWithOffset;
        }

        return null;
      }
      case 2: {
        const finalBaseAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        return sharedState.calculateAddress(finalBaseAddress, cpu.registers.X);
      }
    }
    return null;
  }
}

class AbsoluteYAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.lowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1: {
        sharedState.highByte = cpu.Read(cpu.registers.PC++);
        const initialBaseAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        const addressWithOffset = sharedState.calculateAddress(initialBaseAddress, cpu.registers.Y);

        if (!sharedState.pageCrossed) {
          return addressWithOffset;
        }

        return null;
      }
      case 2: {
        const finalBaseAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        return sharedState.calculateAddress(finalBaseAddress, cpu.registers.Y);
      }
    }
    return null;
  }
}

class ZeroPageAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, _sharedState: SharedAddressingState): number {
    return cpu.Read(cpu.registers.PC++);
  }
}

class ZeroPageXAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, _sharedState: SharedAddressingState): number {
    return (cpu.Read(cpu.registers.PC++) + cpu.registers.X) & 0xFF;
  }
}

class ZeroPageYAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, _sharedState: SharedAddressingState): number {
    return (cpu.Read(cpu.registers.PC++) + cpu.registers.Y) & 0xFF;
  }
}

class IndirectAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.lowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1:
        {
          sharedState.highByte = cpu.Read(cpu.registers.PC++);
          const firstIndirectAddress = (sharedState.highByte << 8) | sharedState.lowByte;
          sharedState.indirectLowByte = cpu.Read(firstIndirectAddress);
          return null;
        }
      case 2: {
        const finalIndirectAddress = (sharedState.highByte << 8) | sharedState.lowByte;
        sharedState.indirectHighByte = cpu.Read(finalIndirectAddress + 1);
        return (sharedState.indirectHighByte << 8) | sharedState.indirectLowByte;
      }
    }
    return null;
  }
}

class IndirectXAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.zeroPageLowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1: {
        const firstZeroPageAddress = (sharedState.zeroPageLowByte + cpu.registers.X) & 0xFF;
        sharedState.indirectLowByte = cpu.Read(firstZeroPageAddress);
        return null;
      }
      case 2: {
        const finalZeroPageAddress = (sharedState.zeroPageLowByte + cpu.registers.X) & 0xFF;
        sharedState.indirectHighByte = cpu.Read((finalZeroPageAddress + 1) & 0xFF);
        return (sharedState.indirectHighByte << 8) | sharedState.indirectLowByte;
      }
    }
    return null;
  }
}

class IndirectYAddressing implements AddressingModeStrategy {
  resolve(cpu: ICPU, sharedState: SharedAddressingState): number | null {
    switch (cpu.cycles) {
      case 0: {
        sharedState.zeroPageLowByte = cpu.Read(cpu.registers.PC++);
        return null;
      }
      case 1: {
        sharedState.indirectLowByte = cpu.Read(sharedState.zeroPageLowByte);
        return null;
      }
      case 2: {
        sharedState.indirectHighByte = cpu.Read((sharedState.zeroPageLowByte + 1) & 0xFF);
        const initialBaseAddress = (sharedState.indirectHighByte << 8) | sharedState.indirectLowByte;
        return sharedState.calculateAddress(initialBaseAddress, cpu.registers.Y);
      }
    }
    return null;
  }
}

class AddressingModeFlyweightFactory {
  private static strategies: Map<AddressingMode, AddressingModeStrategy> = new Map();
  private static sharedState: SharedAddressingState = new SharedAddressingState();

  static getStrategy(mode: AddressingMode): AddressingModeStrategy {
    if (!this.strategies.has(mode)) {
      switch (mode) {
        case 'IMPLIED':
          this.strategies.set(mode, new ImpliedAddressing());
          break;
        case "IMMEDIATE":
          this.strategies.set(mode, new ImmediateAddressing());
          break;
        case "ABSOLUTE":
          this.strategies.set(mode, new AbsoluteAddressing());
          break;
        case "ABSOLUTE_X":
          this.strategies.set(mode, new AbsoluteXAddressing());
          break;
        case "ABSOLUTE_Y":
          this.strategies.set(mode, new AbsoluteYAddressing());
          break;
        case "ZERO_PAGE":
          this.strategies.set(mode, new ZeroPageAddressing());
          break;
        case "ZERO_PAGE_X":
          this.strategies.set(mode, new ZeroPageXAddressing());
          break;
        case "ZERO_PAGE_Y":
          this.strategies.set(mode, new ZeroPageYAddressing());
          break;
        case "INDIRECT":
          this.strategies.set(mode, new IndirectAddressing());
          break;
        case "INDEXED_INDIRECT":
          this.strategies.set(mode, new IndirectXAddressing());
          break;
        case "INDIRECT_INDEXED":
          this.strategies.set(mode, new IndirectYAddressing());
          break;
      }
    }
    return this.strategies.get(mode)!;
  }

  static resolve(mode: AddressingMode, cpu: ICPU): number | null {
    return this.getStrategy(mode).resolve(cpu, this.sharedState);
  }
}

export { AddressingModeFlyweightFactory };

