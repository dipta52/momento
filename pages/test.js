const TestPage = () => {
	return (
		<>
			<p>{JSON.stringify({ hello: "world" }, null, 2)}</p>
			<button onClick={() => {}}>Fetch</button>
		</>
	);
};

export default TestPage;
