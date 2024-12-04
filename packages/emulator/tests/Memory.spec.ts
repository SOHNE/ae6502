import { Emulator } from "@sohne/emulator";

describe("MOS6502 Memory", () => {
  const cpu = new Emulator();

  beforeEach(() => {
    cpu.Reset();
  });

  describe("Program Loading", () => {
    it("Load a program into memory at the specified address", () => {
      const program = [0xA9, 0x01, 0x00]; // LDA #$01; BRK
      const initialPC = 0x600;
      cpu.LoadProgram(program, initialPC);

      expect(cpu.registers.PC).toBe(initialPC);
      program.forEach((byte, index) => {
        expect(cpu.Read(initialPC + index)).toBe(byte);
      });
    });

    it("Clear memory on reset", () => {
      const program = [0xA9, 0x01, 0x00]; // LDA #$01; BRK
      const initialPC = 0x600;
      cpu.LoadProgram(program, initialPC);

      // Reset should clear memory
      cpu.Reset();

      program.forEach((_, index) => {
        expect(cpu.Read(initialPC + index)).toBe(0x00);
      });
    });
  });

  describe("Memory Read/Write", () => {
    it("Write and read memory correctly", () => {
      cpu.Write(0x1234, 0x42); // Direct memory write
      expect(cpu.Read(0x1234)).toBe(0x42); // Verify memory read
    });
  });

  describe("Stack Operations", () => {
    describe("Basic Push and Pop", () => {
      it("Push and pop a single byte", () => {
        const testValue = 0x42;
        const initialSP = cpu.registers.SP;

        // Push a value onto the stack
        cpu.Push(testValue);

        // Verify stack pointer decremented
        expect(cpu.registers.SP).toBe(initialSP - 1);

        // Pop the value from the stack
        const poppedValue = cpu.Pop();

        // Verify the popped value matches the pushed value
        expect(poppedValue).toBe(testValue);

        // Verify stack pointer returned to initial state
        expect(cpu.registers.SP).toBe(initialSP);
      });

      it("Push multiple bytes and pop in reverse order", () => {
        const values = [0x11, 0x22, 0x33, 0x44];
        const initialSP = cpu.registers.SP;

        // Push multiple values
        values.forEach(value => cpu.Push(value));

        // Verify stack pointer decremented correctly
        expect(cpu.registers.SP).toBe(initialSP - values.length);

        // Pop values and verify in reverse order
        for (let i = values.length - 1; i >= 0; --i) {
          const poppedValue = cpu.Pop();
          expect(poppedValue).toBe(values[i]);
        }

        // Verify stack pointer returned to initial state
        expect(cpu.registers.SP).toBe(initialSP);
      });
    });

    describe("Stack Boundary Conditions", () => {
      it("Stack overflow and underflow", () => {
        const initialSP = cpu.registers.SP;

        // Push maximum number of bytes possible on stack
        for (let i = 0; i < 256; ++i) {
          cpu.Push(i);
        }

        // Stack pointer should wrap around to 0xFF
        expect(cpu.registers.SP).toBe(0xFF);

        // Pop all values
        for (let i = 0; i < 256; ++i) {
          cpu.Pop();
        }

        // Stack pointer should return to initial state
        expect(cpu.registers.SP).toBe(initialSP);
      });

      it("Maintain stack memory location integrity", () => {
        const testValue = 0xAA;
        const initialSP = cpu.registers.SP;

        // Push a value
        cpu.Push(testValue);

        // Verify the value is written to the correct stack memory location
        const stackAddress = 0x100 + initialSP;
        expect(cpu.Read(stackAddress)).toBe(testValue);
      });
    });
  });
});
