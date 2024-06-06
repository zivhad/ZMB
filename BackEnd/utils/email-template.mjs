export const templateHtml = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>ZMB Email</title>
		<style>
			table {
				box-sizing: border-box;
			}

			table {
				width: 50%;
				margin: 3% ;
				margin-left : 20%;
				border-collapse: collapse;
				table-layout: fixed;
			}
			td {
				text-align: left;
				padding: 0;
				vertical-align: top;
				font-size:1rem;
				height: 2.5rem;
				background-color: bisque;
			}

			.tr-last td {
				background-color: transparent;
			}
			.img-td {
				background-color: transparent;
				vertical-align: middle;
				background-image: linear-gradient(0deg, transparent 50%, bisque 50%);
			}
			img {
				width: 100%;
			}
		</style>
	</head>
	<body>
		<table>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td></td>

				<td rowspan="8" colspan="9">
				MESSAGE
				</td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>

				<td></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td colspan="2" rowspan="2" class="img-td">
					<img src="cid:z.m.b-01.png" alt="logo" />
				</td>
			</tr>
			<tr class="tr-last">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</table>
	</body>
</html>
`
