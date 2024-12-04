import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import { Emulator } from '@sohne/emulator';
import MemoryView from './memoryView.js';
import RegisterView from './registerView.js';

// Sample 6502 machine code (a simple example)
const SAMPLE_PROGRAM: number[] = [
	0xA9, 0x42,   // LDA #$42 (Load accumulator with value $42)
	0x8D, 0x00, 0x02, // STA $0200 (Store accumulator at memory address $2000)
];

// Log entry type
type LogEntry = {
	type: 'log' | 'warn' | 'error';
	message: string;
};

// Console capture component
function Console(): React.ReactElement {
	const [logs, setLogs] = useState<LogEntry[]>([]);

	useEffect(() => {
		// Capture console methods
		const originalLog = console.log;
		const originalWarn = console.warn;
		const originalError = console.error;

		// Type-safe console override
		console.log = (...args: unknown[]) => {
			const message = args.map(String).join(' ');
			setLogs(prev => [...prev, { type: 'log', message }]);
			originalLog(...args);
		};

		console.warn = (...args: unknown[]) => {
			const message = args.map(String).join(' ');
			setLogs(prev => [...prev, { type: 'warn', message }]);
			originalWarn(...args);
		};

		console.error = (...args: unknown[]) => {
			const message = args.map(String).join(' ');
			setLogs(prev => [...prev, { type: 'error', message }]);
			originalError(...args);
		};

		// Capture unhandled errors and rejections
		const uncaughtExceptionHandler = (err: Error) => {
			setLogs(prev => [...prev, {
				type: 'error',
				message: `Uncaught Exception: ${err.message}\n${err.stack || ''}`
			}]);
		};

		const unhandledRejectionHandler = (reason: unknown) => {
			const message = reason instanceof Error
				? reason.message
				: String(reason);

			setLogs(prev => [...prev, {
				type: 'error',
				message: `Unhandled Rejection: ${message}`
			}]);
		};

		process.on('uncaughtException', uncaughtExceptionHandler);
		process.on('unhandledRejection', unhandledRejectionHandler);

		// Cleanup
		return () => {
			console.log = originalLog;
			console.warn = originalWarn;
			console.error = originalError;
			process.off('uncaughtException', uncaughtExceptionHandler);
			process.off('unhandledRejection', unhandledRejectionHandler);
		};
	}, []);

	return (
		<Box flexDirection="column" borderStyle="single" marginTop={1}>
			<Text color="white" bold>Console Output:</Text>
			{logs.map((log, index) => (
				<Text
					key={index}
					color={
						log.type === 'log' ? 'white' :
							log.type === 'warn' ? 'yellow' :
								'red'
					}
				>
					{log.message}
				</Text>
			))}
		</Box>
	);
}

// Memory View Mode Type
type MemoryViewMode = 'hex' | 'dec';

// Memory Range Type
type MemoryRange = {
	start: number;
	end: number;
};

function App(): React.ReactElement {
	const [emulator] = useState<Emulator>(new Emulator());
	const [memoryRange, setMemoryRange] = useState<MemoryRange>({ start: 0x200, end: 0x220 });
	const [_memoryViewMode, setMemoryViewMode] = useState<MemoryViewMode>('hex');
	const { exit } = useApp();

	useEffect(() => {
		// Load the sample program
		emulator.LoadProgram(SAMPLE_PROGRAM);
	}, [emulator]);

	useInput((input, key) => {
		if (key.escape || key.ctrl && input === 'c') {
			exit();
		}

		if (input === 't') {
			// Tick the emulator
			emulator.Tick();
		}

		if (input === 'r') {
			emulator.Reset();
			emulator.LoadProgram(SAMPLE_PROGRAM);
		}

		// Enhanced memory range controls
		if (key.pageUp) {
			setMemoryRange(prev => ({
				start: Math.max(0, prev.start - 16),
				end: Math.max(16, prev.end - 16)
			}));
		}

		if (key.pageDown) {
			setMemoryRange(prev => ({
				start: Math.min(0xFFFF - 16, prev.start + 16),
				end: Math.min(0xFFFF, prev.end + 16)
			}));
		}

		// Toggle memory view mode
		if (input === 'm') {
			setMemoryViewMode(prev => (prev === 'hex' ? 'dec' : 'hex'));
		}
	});

	return (
		<Box flexDirection="column">
			<Gradient name="cristal">
				<BigText text="ae6502" />
			</Gradient>

			<Box>
				<Box marginRight={1}>
					<RegisterView registers={emulator.registers} />
				</Box>

				<Box borderStyle="single" flexDirection="column">
					<Text color="green">Memory View:</Text>
					<MemoryView emulator={emulator} start={memoryRange.start} />
				</Box>
			</Box>

			<Console />

			<Text color="white">
				Controls: [ to scroll up, ] to scroll down, m to toggle memory view mode, t to tick the emulator, Ctrl+C to exit.
			</Text>
		</Box>
	);
}

export default App;
