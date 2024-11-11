

const Course = ({ course }) => {

  const Header = ({ course }) => <h1>{course.name}</h1>;

  const Content = ({ parts }) => {

    const Total = ({ parts }) => {
      const initialTotal = 0;
      const sum = parts.reduce((s, p) => s + p.exercises, initialTotal);
      return (
        <div>
          <h3>total of {sum} exercises</h3>
        </div>
      );
    };

    const Part = ({ part }) => (
      <p>
        {part.name} {part.exercises}
      </p>
    );

    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} part={part} />
        ))}
        <Total parts={parts} />
      </div>
    );
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
