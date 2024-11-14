import { check, sleep } from "k6";
import { SharedArray }  from "k6/data";
import http             from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

const students = new SharedArray("students", () => [
	{ username: "maria1" },
	{ username: "pablo3" },
	{ username: "ivan2" },
	{ username: "marta6" },
	{ username: "aross656" }
]);

const teachers = new SharedArray("teachers", () => [
	{ email: "email1@email.com", password: "pass123*" },
	{ email: "email2@email.com", password: "pass123*" },
	{ email: "email3@email.com", password: "pass123*" },
	{ email: "email4@email.com", password: "pass123*" },
	{ email: "email5@email.com", password: "pass123*" }
]);

export let options = {
	stages: [
		{ duration: "5s", target: 5 }, { duration: "5s", target: 5 }
	]
};

let loginAsStudent = (student) => {
	const loginPayload = JSON.stringify(student);
	const loginHeaders = { "Content-Type": "application/json" };
	const url = "https://hytex-usersservice-production.up.railway.app/students/login";

	let res = http.post(url, loginPayload, { headers: loginHeaders });

	check(res, {
		"student login successful": (r) => r.status === 200
	});

	if ( res.status !== 200 ) {
		console.error(`Student login failed for ${ student.username }`);
		return null;
	}

	return res.json("accessToken");
};

let loginAsTeacher = (teacher) => {
	const loginPayload = JSON.stringify(teacher);
	const loginHeaders = { "Content-Type": "application/json" };
	const url = "https://hytex-usersservice-production.up.railway.app/teachers/login";

	let res = http.post(url, loginPayload, { headers: loginHeaders });

	check(res, {
		"teacher login successful": (r) => r.status === 200
	});

	if ( res.status !== 200 ) {
		console.error(`Teacher login failed for ${ teacher.email }`);
		return null;
	}

	return res.json("accessToken");
};

export default () => {

	if ( __VU <= 5 ) {
		const student = students[ __VU % students.length ];
		const authToken = loginAsStudent(student);
		if ( authToken ) {
			const headers = { Authorization: `Bearer ${ authToken }` };
			testHomePage(headers);
		} else {
			console.error("Skipping home page tests due to login failure");
		}
	} else if ( __VU > 5 && __VU <= 10 ) {
		const teacher = teachers[ __VU % teachers.length ];
		const authToken = loginAsTeacher(teacher);
		if ( authToken ) {
			const headers = { Authorization: `Bearer ${ authToken }` };
			testHomePage(headers);
		} else {
			console.error("Skipping home page tests due to login failure");
		}
	}

	sleep(1);
};

let testHomePage = (headers) => {
	const response = http.get("https://hytex-front-production.up.railway.app/", { headers });
	check(response, {
		"homepage loaded": (res) => res.status === 200
	});
};

export function handleSummary(data) {
	return {
		"./tests/load/summary.html": htmlReport(data),
	};
}