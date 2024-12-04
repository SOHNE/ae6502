import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useInput } from 'ink';
import { Emulator } from '@sohne/emulator';

// Custom hook to get terminal dimensions
function useTerminalSize() {
	const [size, setSize] = useState({
		width: process.stdout.columns,
		height: process.stdout.rows
	});

	useEffect(() => {
		const onResize = () => {
			setSize({
				width: process.stdout.columns,
				height: process.stdout.rows
			});
		};

		process.stdout.on('resize', onResize);
		return () => {
			process.stdout.off('resize', onResize);
		};
	}, []);

	return [size.width, size.height];
}

type MemoryViewProps = {
	emulator: Emulator;
	start: number;
};

function MemoryView({
	emulator,
	start
}: MemoryViewProps): React.ReactElement {
	const [_, height] = useTerminalSize();
	const [rows, setRows] = useState(10);
	const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

	useEffect(() => {
		const calculatedRows = Math.max(10, Math.floor((height || 20) / 2) - 2);
		setRows(calculatedRows);
	}, [height]);

	// Use Ink's useInput hook for navigation
	useInput((input, _key) => {
		if (input === "k") {
			setSelectedCell(prev => ({
				row: Math.max(0, prev.row - 1),
				col: prev.col
			}));
		} else if (input === "j") {
			setSelectedCell(prev => ({
				row: Math.min(rows - 1, prev.row + 1),
				col: prev.col
			}));
		} else if (input === "l") {
			setSelectedCell(prev => ({
				row: prev.row,
				col: Math.min(15, prev.col + 1)
			}));
		} else if (input === "h") {
			setSelectedCell(prev => ({
				row: prev.row,
				col: Math.max(0, prev.col - 1)
			}));
		}
	});

	const memorySlice = useMemo(() => {
		const slice: number[] = [];
		const end = start + (rows * 16);
		for (let addr = start; addr < end; addr++) {
			slice.push(emulator.Read(addr));
		}
		return slice;
	}, [emulator, start, rows]);

	const renderColumnHeaders = () => {
		return (
			<Box flexDirection="row">
				<Box flexDirection="row" marginLeft={8}>
					{[...Array(16)].map((_, i) => (
						<Box key={i} width={3}>
							<Text color="white">{i.toString(16).toUpperCase()}</Text>
						</Box>
					))}
				</Box>
				<Box marginLeft={2}>
					<Text color="white">ASCII</Text>
				</Box>
			</Box>
		);
	};

	const renderMemoryView = () => {
		return (
			<Box flexDirection="column">
				{[...Array(rows)].map((_, rowIndex) => {
					const rowStart = rowIndex * 16;
					const rowSlice = memorySlice.slice(rowStart, rowStart + 16);

					return (
						<Box key={rowIndex} flexDirection="row">
							{/* Address */}
							<Box width={8}>
								<Text color="gray">
									{`${(start + rowStart).toString(16).toUpperCase().padStart(4, '0')}`}
								</Text>
							</Box>

							{/* Hex Values */}
							<Box flexDirection="row">
								{rowSlice.map((byte, colIndex) => {
									const hexValue = byte.toString(16).toUpperCase().padStart(2, '0');
									const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
									return (
										<Box key={colIndex} width={3}>
											<Text
												color={isSelected ? "white" : (byte === 0 ? "gray" : "cyan")}
												backgroundColor={isSelected ? "blue" : undefined}
											>
												{hexValue}
											</Text>
										</Box>
									);
								})}
								{/* Pad remaining columns */}
								{[...Array(16 - rowSlice.length)].map((_, i) => (
									<Box key={`pad-${i}`} width={3}>
										<Text>{' '}</Text>
									</Box>
								))}
							</Box>

							{/* ASCII */}
							<Box marginLeft={2} flexDirection="row">
								{rowSlice.map((byte, colIndex) => {
									const asciiChar = (byte >= 32 && byte <= 126)
										? String.fromCharCode(byte)
										: '.';
									const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
									return (
										<Text
											key={colIndex}
											color={isSelected ? "white" : "magenta"}
											backgroundColor={isSelected ? "blue" : undefined}
										>
											{asciiChar}
										</Text>
									);
								})}
							</Box>
						</Box>
					);
				})}
			</Box>
		);
	};

	return (
		<Box flexDirection="column">
			{renderColumnHeaders()}
			{renderMemoryView()}
			<Box marginTop={1}>
				<Text color="gray">
					Use arrow keys to navigate memory cells
				</Text>
			</Box>
		</Box>
	);
}

export default MemoryView;
