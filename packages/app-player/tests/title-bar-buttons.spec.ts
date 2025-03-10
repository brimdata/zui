import { play } from 'app-player';

play('title bar buttons', (app, test) => {
  test('click new tab', async () => {
    await app.click('button', 'New Tab');
    await app.attached(/Query Session/);
  });

  test('toggle left sidebar', async () => {
    await app.click('button', 'Toggle Left Sidebar');
    await app.detached(/http:\/\/localhost:9867/);
    await app.click('button', 'Toggle Left Sidebar');
    await app.attached(/http:\/\/localhost:9867/);
  });

  test('toggle right sidebar', async () => {
    await app.attached('button', 'History');
    await app.click('button', 'Toggle Right Sidebar');
    await app.detached('button', 'History');
    await app.click('button', 'Toggle Right Sidebar');
    await app.attached('button', 'History');
  });
});
