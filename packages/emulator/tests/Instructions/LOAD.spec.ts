import { Emulator } from "@sohne/emulator";

// TODO: Implement ABSOLUTE's and INDIRECTS's
describe('LOAD Instructions', () => {
  let cpu: Emulator;

  beforeAll(() => {
    cpu = new Emulator();
  });

  beforeEach((): void => {
    cpu.Reset();
  });

  describe('LDA', () => {
    test('Immediate - Load Accumulator with Immediate Value', () => {
      const program = [0xA9, 0x42];
      cpu.LoadProgram(program);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.A).toBe(0x42);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });

    test('Zero Page - Load Accumulator from Zero Page', () => {
      const program = [0xA5, 0x10];
      cpu.LoadProgram(program);

      // Preset zero page memory location
      cpu.Write(0x10, 0x55);

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

    test('Zero Page,X - Load Accumulator from Zero Page Indexed by X', () => {
      const program = [0xB5, 0x10];
      cpu.LoadProgram(program);

      // Preset X register and memory
      cpu.registers.X = 0x04;
      cpu.Write(0x14, 0x77);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.A).toBe(0x77);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('LDX', () => {
    test('Immediate - Load X with Immediate Value', () => {
      const program = [0xA2, 0x42];
      cpu.LoadProgram(program);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.X).toBe(0x42);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });

    test('Zero Page - Load X from Zero Page', () => {
      const program = [0xA6, 0x10];
      cpu.LoadProgram(program);

      // Preset zero page memory location
      cpu.Write(0x10, 0x55);

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

    test('Zero Page,Y - Load X from Zero Page Indexed by Y', () => {
      const program = [0xB6, 0x10];
      cpu.LoadProgram(program);

      // Preset Y register and memory
      cpu.registers.Y = 0x04;
      cpu.Write(0x14, 0x77);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.X).toBe(0x77);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });

  describe('LDY', () => {
    test('Immediate - Load Y with Immediate Value', () => {
      const program = [0xA0, 0x42];
      cpu.LoadProgram(program);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.Y).toBe(0x42);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });

    test('Zero Page - Load Y from Zero Page', () => {
      const program = [0xA4, 0x10];
      cpu.LoadProgram(program);

      // Preset zero page memory location
      cpu.Write(0x10, 0x55);

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

    test('Zero Page,X - Load Y from Zero Page Indexed by X', () => {
      const program = [0xB4, 0x10];
      cpu.LoadProgram(program);

      // Preset X register and memory
      cpu.registers.X = 0x04;
      cpu.Write(0x14, 0x77);

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.registers.Y).toBe(0x77);
      expect(cpu.registers.P & 0x02).toBe(0x00); // Not Zero
      expect(cpu.registers.P & 0x80).toBe(0x00); // Not Negative
    });
  });
});
