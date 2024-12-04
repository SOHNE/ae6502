import { Emulator, INSTRUCTION_STATE } from '@sohne/emulator';

describe('MOS6502 CPU', () => {
  const cpu = new Emulator();

  beforeEach(() => {
    cpu.Reset();
  });

  describe('CPU Initialization', () => {
    it('should initialize CPU state correctly on reset', () => {
      const { registers: state } = cpu;

      expect(state.A).toBe(0);
      expect(state.X).toBe(0);
      expect(state.Y).toBe(0);
      expect(state.SP).toBe(0xFF);
      expect(state.PC).toBe(0);
      expect(state.P).toBe(0x20);
      expect(cpu.instState).toBe(INSTRUCTION_STATE.FETCH);
      expect(cpu.Read(0x200)).toBe(0);
    });
  });

  describe('CPU State Management', () => {
    it('should reset to initial state multiple times', () => {
      // Modify some state
      cpu.registers.A = 0x42;
      cpu.registers.PC = 0x1234;

      // Reset
      cpu.Reset();

      // Check if state is restored
      const { registers: state } = cpu;
      expect(state.A).toBe(0x0);
      expect(state.PC).toBe(0x0);
    });

    it('should handle multiple consecutive resets', () => {
      for (let i = 0; i < 3; i++) {
        cpu.Reset();

        const { registers: state } = cpu;
        expect(state.SP).toBe(0xFF);
        expect(state.PC).toBe(0x0);
        expect(state.P).toBe(0x20);
      }
    });
  });

  describe('Error Handling', () => {
    it('should throw an error for unknown opcode', () => {
      cpu.LoadProgram([0xFF], 0x600); // Invalid opcode

      expect(() => {
        cpu.Tick(); // Fetch
      }).toThrow('Unknown opcode: $FF');
    });
  });

});
