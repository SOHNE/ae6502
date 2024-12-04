import { IBus } from "./types";

/**
 * Represents a memory access error
 */
export class MemoryAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MemoryAccessError";
  }
}

/**
 * Bus class implements a simple memory management system
 * Provides basic read, write, load, and dump operations for a memory space
 * Implements the Memory interface from types
 */
export default class Memory implements IBus {
  /**
   * Internal memory storage
   */
  private memory: Uint8Array;

  /**
   * Constructor initializes memory
   *
   * @param {number} size - Total memory size in bytes
   * @default 0x10000 (64KB) - Standard 6502 memory space
   * @throws {MemoryAccessError} If requested memory size is invalid
   */
  constructor(size: number = 0x10000) {
    this.memory = new Uint8Array(size).fill(0x00);
  }

  public reset(): void {
    this.memory.fill(0x00);
  }

  /**
   * Reads a byte from the specified memory address
   *
   * @param {number} address - Memory address to read from
   * @returns {number} The byte value at the given address
   * @throws {MemoryAccessError} If address is out of bounds
   */
  public read(address: number): number {
    // Validate address
    if (address < 0 || address >= this.memory.length) {
      throw new MemoryAccessError(`Memory read access violation: Address ${address.toString(16)} is out of bounds`);
    }

    return this.memory[address];
  }

  /**
   * Writes a byte to the specified memory address
   *
   * @param {number} address - Memory address to write to
   * @param {number} value - Byte value to write
   * @throws {MemoryAccessError} If address is out of bounds or value is invalid
   */
  public write(address: number, value: number): void {
    // Validate address
    if (address < 0 || address >= this.memory.length) {
      throw new MemoryAccessError(`Memory write access violation: Address ${address.toString(16)} is out of bounds`);
    }

    // Validate value
    if (value < 0 || value > 0xFF) {
      throw new MemoryAccessError(`Invalid byte value: ${value}. Must be between 0 and 255`);
    }

    this.memory[address] = value;
  }

  /**
   * Loads an array of bytes into memory starting at a specified address
   *
   * @param {number[]} data - Array of bytes to load into memory
   * @param {number} startAddress - Starting memory address for loading
   * @throws {MemoryAccessError} If load would exceed memory bounds
   */
  public load(data: number[], startAddress: number): void {
    // Validate start address
    if (startAddress < 0 || startAddress >= this.memory.length) {
      throw new MemoryAccessError(`Invalid load start address: ${startAddress.toString(16)}`);
    }

    // Validate that the entire data block fits in memory
    if (startAddress + data.length > this.memory.length) {
      throw new MemoryAccessError(`Load would exceed memory bounds. Start: ${startAddress.toString(16)}, Data length: ${data.length}`);
    }

    // Iterate through data and write each byte to sequential addresses
    for (let i = 0; i < data.length; ++i) {
      this.write(startAddress + i, data[i]);
    }
  }

  /**
   * Dumps a specified range of memory
   *
   * @param {number} startAddress - Starting memory address for dump
   * @param {number} length - Number of bytes to dump
   * @returns {number[]} Array of bytes from the specified memory range
   * @throws {MemoryAccessError} If dump range is out of bounds
   */
  public dump(startAddress: number = 0x00, length: number = this.memory.length): number[] {
    // Validate start address
    if (startAddress < 0 || startAddress >= this.memory.length) {
      throw new MemoryAccessError(`Invalid dump start address: ${startAddress.toString(16)}`);
    }

    // Validate that the entire dump range fits in memory
    if (startAddress + length > this.memory.length) {
      throw new MemoryAccessError(`Dump would exceed memory bounds. Start: ${startAddress.toString(16)}, Length: ${length}`);
    }

    // Create and return a new array with the specified memory range
    return Array.from(this.memory.slice(startAddress, startAddress + length));
  }
}
