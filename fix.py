with open('game.js', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '// 3. Enemy stomping checking' in line and 'this.enemies.forEach(enemy => {' in lines[i+1]:
        # check if it's the broken one
        if 'const hitX = px < enemy.x + enemy.width && px + pw > enemy.x;' in lines[i+4] and '// 2. Lava Flower collections' in lines[i+5]:
            skip = True
            
    if skip and '// 3. Enemy stomping checking' in line and 'this.enemies.forEach(enemy => {' in lines[i+1]:
        # If it's the good one, stop skipping
        if 'const hitX = px < enemy.x + enemy.width && px + pw > enemy.x;' in lines[i+4] and 'const hitY = py < enemy.y + enemy.height && py + ph > enemy.y;' in lines[i+5]:
            skip = False

    if not skip:
        new_lines.append(line)

with open('game.js', 'w') as f:
    f.writelines(new_lines)
