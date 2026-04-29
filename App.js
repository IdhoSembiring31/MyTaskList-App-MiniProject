import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('Semua'); // Semua / Aktif / Selesai

  const addTask = () => {
    if (taskInput.trim() === '') {
      Alert.alert('Oops!', 'Task tidak boleh kosong ya bro 🔥');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskInput.trim(),
      done: false,
      priority: 'Sedang', // default
    };

    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const changePriority = (id, newPriority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority: newPriority } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Aktif') return !task.done;
    if (filter === 'Selesai') return task.done;
    return true;
  });

  const completedCount = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;

  const getPriorityColor = (priority) => {
    if (priority === 'Tinggi') return '#FF3B5C';
    if (priority === 'Sedang') return '#FF9500';
    return '#00D4FF';
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => toggleDone(item.id)}
      >
        <View style={[
          styles.checkCircle,
          item.done && styles.checkCircleDone
        ]}>
          {item.done && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text style={[
          styles.taskTitle,
          item.done && styles.taskDone
        ]}>
          {item.title}
        </Text>
        
        <View style={styles.priorityContainer}>
          {['Tinggi', 'Sedang', 'Rendah'].map(prio => (
            <TouchableOpacity
              key={prio}
              style={[
                styles.priorityBadge,
                { backgroundColor: item.priority === prio ? getPriorityColor(prio) : '#333' }
              ]}
              onPress={() => changePriority(item.id, prio)}
            >
              <Text style={styles.priorityText}>{prio[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#0F0F1A', '#1A1A2E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>MyTaskList</Text>
        <Text style={styles.subtitle}>Stay focused. Get shit done.</Text>
      </View>

      {/* Input Form */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Apa yang mau dikerjain hari ini?"
          placeholderTextColor="#888"
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Counter & Filter */}
      <View style={styles.statsContainer}>
        <Text style={styles.counter}>
          {completedCount} / {totalTasks} selesai
        </Text>

        <View style={styles.filterContainer}>
          {['Semua', 'Aktif', 'Selesai'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.filterBtnActive
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText,
                filter === f && styles.filterTextActive
              ]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌟</Text>
            <Text style={styles.emptyText}>Belum ada task</Text>
            <Text style={styles.emptySubtext}>Tambahin dulu yuk, bro!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Info */}
      <Text style={styles.footer}>MyTaskList • Custom by Grok • Modern Dark UI</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#00D4FF',
    fontSize: 16,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addButton: {
    backgroundColor: '#00D4FF',
    borderRadius: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterBtnActive: {
    backgroundColor: '#00D4FF',
  },
  filterText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  checkbox: {
    marginRight: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkmark: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 26,
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF3B5C',
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#777',
    marginTop: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#555',
    fontSize: 12,
    paddingVertical: 20,
  },
});

export default App;