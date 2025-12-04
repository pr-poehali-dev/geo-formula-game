import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type ShapeType = 'triangle' | 'square' | 'rectangle' | 'rhombus' | 'pentagon' | 'hexagon';

interface Task {
  shape: ShapeType;
  sides: number[];
  correctAnswer: number;
}

interface Level {
  id: number;
  name: string;
  description: string;
  shapes: ShapeType[];
}

interface Record {
  level: number;
  score: number;
  total: number;
  date: string;
  percentage: number;
}

const levels: Level[] = [
  {
    id: 1,
    name: 'Уровень 1: Базовые фигуры',
    description: 'Треугольники и квадраты',
    shapes: ['triangle', 'square']
  },
  {
    id: 2,
    name: 'Уровень 2: Четырёхугольники',
    description: 'Прямоугольники и ромбы',
    shapes: ['rectangle', 'rhombus']
  },
  {
    id: 3,
    name: 'Уровень 3: Многоугольники',
    description: 'Пятиугольники и шестиугольники',
    shapes: ['pentagon', 'hexagon']
  }
];

const shapeNames: Record<ShapeType, string> = {
  triangle: 'Треугольник',
  square: 'Квадрат',
  rectangle: 'Прямоугольник',
  rhombus: 'Ромб',
  pentagon: 'Пятиугольник',
  hexagon: 'Шестиугольник'
};

const generateTask = (shape: ShapeType): Task => {
  let sides: number[] = [];
  
  switch (shape) {
    case 'triangle':
      sides = [
        Math.floor(Math.random() * 10) + 5,
        Math.floor(Math.random() * 10) + 5,
        Math.floor(Math.random() * 10) + 5
      ];
      break;
    case 'square':
      const side = Math.floor(Math.random() * 15) + 5;
      sides = [side, side, side, side];
      break;
    case 'rectangle':
      const length = Math.floor(Math.random() * 15) + 5;
      const width = Math.floor(Math.random() * 10) + 3;
      sides = [length, width, length, width];
      break;
    case 'rhombus':
      const rhombusSide = Math.floor(Math.random() * 12) + 5;
      sides = [rhombusSide, rhombusSide, rhombusSide, rhombusSide];
      break;
    case 'pentagon':
      const pentagonSide = Math.floor(Math.random() * 10) + 4;
      sides = Array(5).fill(pentagonSide);
      break;
    case 'hexagon':
      const hexagonSide = Math.floor(Math.random() * 8) + 4;
      sides = Array(6).fill(hexagonSide);
      break;
  }
  
  const correctAnswer = sides.reduce((sum, side) => sum + side, 0);
  
  return { shape, sides, correctAnswer };
};

const ShapeVisualization = ({ shape, sides }: { shape: ShapeType; sides: number[] }) => {
  const renderShape = () => {
    switch (shape) {
      case 'triangle':
        return (
          <svg viewBox="0 0 200 180" className="w-full h-48">
            <polygon points="100,20 20,160 180,160" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="100" y="15" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
            <text x="40" y="175" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[1]} см</text>
            <text x="190" y="100" textAnchor="start" className="text-sm font-medium fill-foreground">{sides[2]} см</text>
          </svg>
        );
      case 'square':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="100" y="30" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
            <text x="170" y="105" textAnchor="start" className="text-sm font-medium fill-foreground">{sides[1]} см</text>
          </svg>
        );
      case 'rectangle':
        return (
          <svg viewBox="0 0 240 160" className="w-full h-48">
            <rect x="30" y="40" width="180" height="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="120" y="30" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
            <text x="220" y="85" textAnchor="start" className="text-sm font-medium fill-foreground">{sides[1]} см</text>
          </svg>
        );
      case 'rhombus':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="140" y="50" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
          </svg>
        );
      case 'pentagon':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <polygon points="100,20 180,80 150,170 50,170 20,80" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="140" y="40" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <text x="135" y="35" textAnchor="middle" className="text-sm font-medium fill-foreground">{sides[0]} см</text>
          </svg>
        );
    }
  };
  
  return <div className="flex justify-center items-center bg-muted/30 rounded-lg p-8">{renderShape()}</div>;
};

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedRecords = localStorage.getItem('geometryRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveRecord = (level: number, score: number, total: number) => {
    const newRecord: Record = {
      level,
      score,
      total,
      date: new Date().toLocaleDateString('ru-RU'),
      percentage: Math.round((score / total) * 100)
    };
    const updatedRecords = [...records, newRecord].sort((a, b) => b.percentage - a.percentage).slice(0, 10);
    setRecords(updatedRecords);
    localStorage.setItem('geometryRecords', JSON.stringify(updatedRecords));
  };

  const startLevel = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    setScore(0);
    setTasksCompleted(0);
    generateNewTask(levelIndex);
  };

  const generateNewTask = (levelIndex: number) => {
    const level = levels[levelIndex];
    const randomShape = level.shapes[Math.floor(Math.random() * level.shapes.length)];
    const task = generateTask(randomShape);
    setCurrentTask(task);
    setUserAnswer('');
    setShowResult(false);
  };

  const checkAnswer = () => {
    if (!currentTask || userAnswer === '') return;

    const answer = parseFloat(userAnswer);
    const correct = Math.abs(answer - currentTask.correctAnswer) < 0.01;
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      toast({
        title: "Правильно! ✓",
        description: `Периметр = ${currentTask.correctAnswer} см`,
        className: "bg-green-50 border-green-200"
      });
    } else {
      toast({
        title: "Неверно ✗",
        description: `Правильный ответ: ${currentTask.correctAnswer} см`,
        variant: "destructive"
      });
    }

    setTasksCompleted(tasksCompleted + 1);
  };

  const nextTask = () => {
    if (tasksCompleted >= 5) {
      saveRecord(currentLevel + 1, score, tasksCompleted);
      toast({
        title: "Уровень завершён!",
        description: `Ваш результат: ${score} из ${tasksCompleted}`,
        className: "bg-blue-50 border-blue-200"
      });
      setCurrentTask(null);
      return;
    }
    generateNewTask(currentLevel);
  };

  const goToMenu = () => {
    setCurrentTask(null);
    setScore(0);
    setTasksCompleted(0);
  };

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground mb-3">Геометрия: Периметры</h1>
            <p className="text-lg text-muted-foreground">Образовательная игра для 7-9 классов</p>
          </div>

          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setShowLeaderboard(!showLeaderboard)} 
              variant={showLeaderboard ? "default" : "outline"}
              size="lg"
              className="gap-2"
            >
              <Icon name="Trophy" size={20} />
              {showLeaderboard ? 'Скрыть рекорды' : 'Таблица рекордов'}
            </Button>
          </div>

          {showLeaderboard && records.length > 0 && (
            <Card className="p-6 mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Medal" size={24} className="text-yellow-500" />
                Лучшие результаты
              </h2>
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' : 
                        index === 2 ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Уровень {record.level}</p>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{record.percentage}%</p>
                      <p className="text-sm text-muted-foreground">{record.score}/{record.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid gap-6">
            {levels.map((level, index) => (
              <Card key={level.id} className="p-8 hover:shadow-lg transition-all duration-300 hover-scale">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{level.id}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">{level.name}</h2>
                        <p className="text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {level.shapes.map((shape) => (
                        <span key={shape} className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-secondary-foreground">
                          {shapeNames[shape]}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startLevel(index)} 
                    size="lg"
                    className="ml-4 gap-2"
                  >
                    Начать
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
            <div className="flex gap-4">
              <Icon name="Info" size={24} className="text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Как играть:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Выберите уровень сложности</li>
                  <li>• Рассчитайте периметр фигуры, сложив длины всех сторон</li>
                  <li>• Введите ответ и проверьте результат</li>
                  <li>• Каждый уровень содержит 5 задач</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={goToMenu} className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Меню
          </Button>
          
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Icon name="Target" size={20} className="text-primary" />
              <span className="font-semibold">{tasksCompleted}/5</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Icon name="Trophy" size={20} className="text-yellow-500" />
              <span className="font-semibold">{score}</span>
            </div>
          </div>
        </div>

        <Card className="p-8 animate-scale-in">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">{levels[currentLevel].name}</h2>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-md font-medium">
                Задача {tasksCompleted + 1}
              </span>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <p className="text-lg font-medium text-foreground mb-2">
                Вычислите периметр {shapeNames[currentTask.shape].toLowerCase()}а:
              </p>
              <p className="text-sm text-muted-foreground">
                Периметр = сумма длин всех сторон
              </p>
            </div>
          </div>

          <ShapeVisualization shape={currentTask.shape} sides={currentTask.sides} />

          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Введите ответ в см"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                  disabled={showResult}
                  className="text-lg h-12"
                />
              </div>
              {!showResult ? (
                <Button onClick={checkAnswer} size="lg" className="px-8 gap-2">
                  Проверить
                  <Icon name="CheckCircle" size={20} />
                </Button>
              ) : (
                <Button onClick={nextTask} size="lg" className="px-8 gap-2">
                  {tasksCompleted >= 5 ? 'Завершить' : 'Далее'}
                  <Icon name="ArrowRight" size={20} />
                </Button>
              )}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} animate-fade-in`}>
                <div className="flex items-center gap-3">
                  <Icon name={isCorrect ? "CheckCircle2" : "XCircle"} size={24} className={isCorrect ? 'text-green-600' : 'text-red-600'} />
                  <div>
                    <p className="font-semibold text-foreground">
                      {isCorrect ? 'Верно!' : 'Неверно'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Правильный ответ: {currentTask.correctAnswer} см
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Формула:</strong> P = a₁ + a₂ + a₃ + ... + aₙ, где a — длина стороны
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;