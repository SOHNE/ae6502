import { Emulator } from "@sohne/emulator";

describe('Transfer Instructions', () => {
  const cpu = new Emulator();

  beforeEach((): void => {
    cpu.Reset();
  });

  describe('TAX - Transfer Accumulator to X', () => {
    test('Transfer Accumulator value to X register', () => {
      const program = [0xAA];
      cpu.LoadProgram(program);

      // Preset Accumulator
      cpu.registers.A = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.X).toBe(0x55);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });

    test('Transfer Zero Accumulator value to X register', () => {
      const program = [0xAA];
      cpu.LoadProgram(program);

      // Preset Accumulator to Zero
      cpu.registers.A = 0x00;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.X).toBe(0x00);
      expect(cpu.registers.P & 0x02).toBe(0x02); // Zero Flag
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('TAY - Transfer Accumulator to Y', () => {
    test('Transfer Accumulator value to Y register', () => {
      const program = [0xA8];
      cpu.LoadProgram(program);

      // Preset Accumulator
      cpu.registers.A = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.Y).toBe(0x55);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('TSX - Transfer Stack Pointer to X', () => {
    test('Transfer Stack Pointer value to X register', () => {
      const program = [0xBA];
      cpu.LoadProgram(program);

      // Preset Stack Pointer
      cpu.registers.SP = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.X).toBe(0x55);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('TXA - Transfer X to Accumulator', () => {
    test('Transfer X register value to Accumulator', () => {
      const program = [0x8A];
      cpu.LoadProgram(program);

      // Preset X register
      cpu.registers.X = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.A).toBe(0x55);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('TXS - Transfer X to Stack Pointer', () => {
    test('Transfer X register value to Stack Pointer', () => {
      const program = [0x9A];
      cpu.LoadProgram(program);

      // Preset X register
      cpu.registers.X = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.SP).toBe(0x55);
    });
  });

  describe('TYA - Transfer Y to Accumulator', () => {
    test('Transfer Y register value to Accumulator', () => {
      const program = [0x98];
      cpu.LoadProgram(program);

      // Preset Y register
      cpu.registers.Y = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.A).toBe(0x55);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });
});
