import { Emulator } from "@sohne/emulator";

describe('6502 Control Instructions', () => {
  const cpu = new Emulator();

  beforeEach(() => {
    cpu.Reset();
  });

  /* -------------------------------------- BRK Command ------------------------------------------------------- */
  describe('BRK Instruction', () => {
    let testContext: {
      initialStackPointer: number;
      finalPC: number;
      finalSP: number;
      finalP: number;
      stackValues: {
        pch: number;
        pcl: number;
        status: number;
      };
    };

    beforeAll(() => {
      // Setup interrupt vector
      cpu.Write(0xFFFE, 0x34);  // Low byte of interrupt handler address
      cpu.Write(0xFFFF, 0x12);  // High byte of interrupt handler address

      const program = [0xA9, 0x01, 0x00]; // LDA #$01; BRK
      cpu.LoadProgram(program, 0x0600);

      // Store initial stack pointer
      const initialStackPointer = cpu.registers.SP;

      // Execute until BRK is processed
      while (cpu.registers.PC < 0x0600 + program.length) {
        do {
          cpu.Tick();
        } while (cpu.instState);
      }

      // Capture test context
      testContext = {
        initialStackPointer,
        finalPC: cpu.registers.PC,
        finalSP: cpu.registers.SP,
        finalP: cpu.registers.P,
        stackValues: {
          pch: cpu.Read(0x0100 + initialStackPointer - 0),
          pcl: cpu.Read(0x0100 + initialStackPointer - 1),
          status: cpu.Read(0x0100 + initialStackPointer - 2)
        }
      };
    });

    it('should jump to correct interrupt vector address', () => {
      const expectedInterruptAddress = 0x1234;
      expect(testContext.finalPC).toBe(expectedInterruptAddress);
    });

    it('should push program counter plus two to the stack', () => {
      expect(testContext.stackValues.pch).toBe(0x06); // PCH of PC+2
      expect(testContext.stackValues.pcl).toBe(0x04); // PCL of PC+2 (address after BRK + 1)
    });

    it('should set break flag when pushing status register', () => {
      expect(testContext.stackValues.status & 0x10).toBe(0x10);
    });

    it('should not automatically set interrupt disable flag', () => {
      expect(testContext.finalP & 0x04).toBe(0x00);
    });

    it('should decrement stack pointer correctly', () => {
      expect(testContext.finalSP).toBe(testContext.initialStackPointer - 3);
    });
  });
  /* -------------------------------------- ~BRK Command ------------------------------------------------------ */
});
