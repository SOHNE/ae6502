import { Emulator } from "@sohne/emulator";

// TODO: Implement ABSOLUTE's and INDIRECTS's
describe('STORE Instructions', () => {
  const cpu = new Emulator();

  beforeEach((): void => {
    cpu.Reset();
  });

  describe('STA', () => {
    test('Zero Page - Store Accumulator to Zero Page', () => {
      const program = [0x85, 0x10];
      cpu.LoadProgram(program);

      // Preset Accumulator
      cpu.registers.A = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x10)).toBe(0x55);
    });

    test('Zero Page,X - Store Accumulator to Zero Page Indexed by X', () => {
      const program = [0x95, 0x10];
      cpu.LoadProgram(program);

      // Preset Accumulator and X register
      cpu.registers.A = 0x77;
      cpu.registers.X = 0x04;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x14)).toBe(0x77);
    });
  });

  describe('STX', () => {
    test('Zero Page - Store X to Zero Page', () => {
      const program = [0x86, 0x10];
      cpu.LoadProgram(program);

      // Preset X register
      cpu.registers.X = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x10)).toBe(0x55);
    });

    test('Zero Page,Y - Store X to Zero Page Indexed by Y', () => {
      const program = [0x96, 0x10];
      cpu.LoadProgram(program);

      // Preset X register and Y register
      cpu.registers.X = 0x77;
      cpu.registers.Y = 0x04;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x14)).toBe(0x77);
    });
  });

  describe('STY', () => {
    test('Zero Page - Store Y to Zero Page', () => {
      const program = [0x84, 0x10];
      cpu.LoadProgram(program);

      // Preset Y register
      cpu.registers.Y = 0x55;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x10)).toBe(0x55);
    });

    test('Zero Page,X - Store Y to Zero Page Indexed by X', () => {
      const program = [0x94, 0x10];
      cpu.LoadProgram(program);

      // Preset Y register and X register
      cpu.registers.Y = 0x77;
      cpu.registers.X = 0x04;

      // Execute instructions
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      expect(cpu.Read(0x14)).toBe(0x77);
    });
  });
});
