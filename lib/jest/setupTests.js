
import '../../node_modules/@testing-library/jest-dom/extend-expect';
import path from 'path';
import dotenv from '../../node_modules/dotenv';

dotenv.config({
	path: path.resolve(process.cwd(), '.env.jest')
});
