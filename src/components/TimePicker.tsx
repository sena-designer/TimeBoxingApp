import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';

interface TimePickerProps {
    label: string;
    value: string;
    onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempHour, setTempHour] = useState(() => parseInt(value.split(':')[0]));
    const [tempMinute, setTempMinute] = useState(() => parseInt(value.split(':')[1]));

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const openPicker = () => {
        setTempHour(parseInt(value.split(':')[0]));
        setTempMinute(parseInt(value.split(':')[1]));
        setModalVisible(true);
    };

    const confirmSelection = () => {
        const newTime = `${String(tempHour).padStart(2, '0')}:${String(tempMinute).padStart(2, '0')}`;
        onChange(newTime);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.valueButton} onPress={openPicker}>
                <Text style={styles.valueText}>{value}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButton}>キャンセル</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={confirmSelection}>
                                <Text style={styles.doneButton}>完了</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.columnLabel}>時</Text>
                                <ScrollView
                                    style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {hours.map(h => (
                                        <TouchableOpacity
                                            key={h}
                                            style={[
                                                styles.pickerItem,
                                                tempHour === h && styles.pickerItemSelected
                                            ]}
                                            onPress={() => setTempHour(h)}
                                        >
                                            <Text style={[
                                                styles.pickerItemText,
                                                tempHour === h && styles.pickerItemTextSelected
                                            ]}>
                                                {String(h).padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <Text style={styles.separator}>:</Text>

                            <View style={styles.pickerColumn}>
                                <Text style={styles.columnLabel}>分</Text>
                                <ScrollView
                                    style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {minutes.map(m => (
                                        <TouchableOpacity
                                            key={m}
                                            style={[
                                                styles.pickerItem,
                                                tempMinute === m && styles.pickerItemSelected
                                            ]}
                                            onPress={() => setTempMinute(m)}
                                        >
                                            <Text style={[
                                                styles.pickerItemText,
                                                tempMinute === m && styles.pickerItemTextSelected
                                            ]}>
                                                {String(m).padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    valueButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cancelButton: {
        fontSize: 16,
        color: '#666',
    },
    doneButton: {
        fontSize: 16,
        color: '#4A90D9',
        fontWeight: '600',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 20,
    },
    pickerColumn: {
        alignItems: 'center',
        width: 80,
    },
    columnLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    scrollView: {
        height: 200,
    },
    pickerItem: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 2,
    },
    pickerItemSelected: {
        backgroundColor: '#4A90D9',
    },
    pickerItemText: {
        fontSize: 20,
        color: '#333',
    },
    pickerItemTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    separator: {
        fontSize: 32,
        fontWeight: '600',
        color: '#333',
        marginTop: 40,
        marginHorizontal: 16,
    },
});
