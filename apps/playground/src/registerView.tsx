import React from 'react';
import { Box, Text } from 'ink';
import { CPUState } from '@sohne/emulator';

// Processor Flag Visualization Component
function ProcessorFlags({ flags }: { flags: number }) {
  const flagLabels = ['N', 'V', '-', 'B', 'D', 'I', 'Z', 'C'];

  return (
    <Box>
      {flagLabels.map((label, index) => {
        // Check if the flag is set (1) or clear (0)
        const isFlagSet = (flags & (1 << (7 - index))) !== 0;

        return (
          <Box key={label} marginRight={1}>
            <Text color={isFlagSet ? 'green' : 'red'}>
              {label}: {isFlagSet ? '+' : '-'}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}

// Enhanced Register View Component
function RegisterView({ registers }: { registers: CPUState }): React.ReactElement {
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="cyan"
      padding={1}
    >
      {/* Registers Section */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Registers:</Text>
        <Box marginLeft={2}>
          <Box marginRight={1}>
            <Text>A:</Text>
            <Text color="yellow"> 0x{registers.A.toString(16).padStart(2, '0')}</Text>
          </Box>
          <Box marginRight={1}>
            <Text>X:</Text>
            <Text color="yellow"> 0x{registers.X.toString(16).padStart(2, '0')}</Text>
          </Box>
          <Box>
            <Text>Y:</Text>
            <Text color="yellow"> 0x{registers.Y.toString(16).padStart(2, '0')}</Text>
          </Box>
        </Box>
      </Box>

      {/* Program Counter Section */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>PC: </Text>
        <Text color="magenta">0x{registers.PC.toString(16).padStart(4, '0')}</Text>
      </Box>

      {/* Stack Pointer Section */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>SP: </Text>
        <Text color="magenta">0x{registers.SP.toString(16).padStart(2, '0')}</Text>
      </Box>

      {/* Processor Flags Section */}
      <Box>
        <Text color="cyan" bold>Flags: </Text>
        <ProcessorFlags flags={registers.P} />
      </Box>
    </Box>
  );
}

export default RegisterView;
