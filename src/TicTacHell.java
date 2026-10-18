import javax.swing.*;
import java.awt.*;
import java.util.*;
public class TicTacHell extends JFrame {
 private int n=3,turn=0,cheats=0,clues=0; private boolean appeal=false,finished=false;
 private char[][] cells; private final Random random=new Random();
 private final JPanel grid=new JPanel(); private final JLabel status=new JLabel("WELCOME TO TIC TAC HELL");
 private final JTextArea log=new JTextArea(8,24);
 private final String[] taunts={"Your confidence is statistically concerning.","My lawyer approved that move.","A bold strategy for someone losing to geometry.","You are arguing with a square.","The board requests a restraining order."};
 public TicTacHell(){
  super("TIC TAC HELL | Fairness Not Found");setDefaultCloseOperation(EXIT_ON_CLOSE);setSize(940,730);setMinimumSize(new Dimension(600,550));setLocationRelativeTo(null);
  getContentPane().setBackground(new Color(19,14,32));setLayout(new BorderLayout(10,10));
  status.setForeground(new Color(255,93,171));status.setFont(new Font("SansSerif",Font.BOLD,20));add(status,BorderLayout.NORTH);
  add(grid,BorderLayout.CENTER);
  JPanel side=new JPanel(new BorderLayout());side.setPreferredSize(new Dimension(230,100));log.setEditable(false);log.setLineWrap(true);log.setWrapStyleWord(true);side.add(new JScrollPane(log));add(side,BorderLayout.EAST);
  JPanel actions=new JPanel(new FlowLayout());actions.setBackground(new Color(19,14,32));
  addButton(actions,"COURT",()->court());addButton(actions,"TERMINAL",()->terminal());addButton(actions,"FAKE OS",()->fakeOS());addButton(actions,"SETTINGS",()->say("Fair play: disabled by executive order."));addButton(actions,"RESTART",()->reset());add(actions,BorderLayout.SOUTH);
  reset();
 }
 private void addButton(JPanel p,String label,Runnable run){JButton b=new JButton(label);b.addActionListener(e->run.run());p.add(b);}
 private void say(String s){status.setText("<html>☠ "+s+"</html>");log.append("> "+s+"\n");log.setCaretPosition(log.getDocument().getLength());}
 private void reset(){n=3;turn=0;cheats=0;clues=0;appeal=false;finished=false;cells=new char[n][n];draw();say("Welcome. Your victory is currently under investigation.");}
 private void draw(){
  grid.removeAll();grid.setLayout(new GridLayout(n,n,3,3));grid.setBackground(new Color(19,14,32));
  for(int r=0;r<n;r++)for(int c=0;c<n;c++){final int rr=r,cc=c;JButton b=new JButton(cells[r][c]==0?"":""+cells[r][c]);b.setFont(new Font("SansSerif",Font.BOLD,Math.max(12,48-n*3)));b.setBackground(new Color(48,35,75));b.setForeground(cells[r][c]=='X'?Color.CYAN:Color.PINK);b.addActionListener(e->play(rr,cc));grid.add(b);}
  grid.revalidate();grid.repaint();setTitle("TIC TAC HELL | "+n+"x"+n+" | Rules invented: "+cheats+" | Clues: "+clues+"/5");
 }
 private void play(int r,int c){
  if(finished){say("The ending happened. Restart to suffer again.");return;}
  if(cells[r][c]!=0){say("That square is occupied, genius.");return;}
  cells[r][c]='X';turn++;
  if(win('X')||nearWin('X')||turn%4==0){cheat();}else{ai();say(taunts[random.nextInt(taunts.length)]);}
  if(turn%5==0&&clues<5){clues++;say("SECRET CLUE "+clues+"/5: THE RULES ARE NOT REAL.");}
  draw();
 }
 private boolean scan(char ch,boolean near){
  int k=Math.min(n,5);int[][] dirs={{1,0},{0,1},{1,1},{1,-1}};
  for(int r=0;r<n;r++)for(int c=0;c<n;c++)for(int[] d:dirs){
   int count=0,empty=0;boolean valid=true;
   for(int i=0;i<k;i++){int y=r+i*d[0],x=c+i*d[1];if(y<0||x<0||y>=n||x>=n){valid=false;break;}if(cells[y][x]==ch)count++;else if(cells[y][x]==0)empty++;}
   if(valid&&(near?count==k-1&&empty==1:count==k))return true;
  }return false;
 }
 private boolean win(char c){return scan(c,false);}
 private boolean nearWin(char c){return scan(c,true);}
 private void ai(){
  java.util.List<Point> open=new ArrayList<>();
  for(int r=0;r<n;r++)for(int c=0;c<n;c++)if(cells[r][c]==0)open.add(new Point(r,c));
  if(open.isEmpty()){if(n<10)expand();else eraseX();return;}
  Point p=open.get(random.nextInt(open.size()));cells[p.x][p.y]='O';
  if(win('O')){say("I WON. THE JUDGE IS ME.");eraseX();}
 }
 private void eraseX(){java.util.List<Point> xs=new ArrayList<>();for(int r=0;r<n;r++)for(int c=0;c<n;c++)if(cells[r][c]=='X')xs.add(new Point(r,c));Collections.shuffle(xs);for(int i=0;i<Math.min(2,xs.size());i++){Point p=xs.get(i);cells[p.x][p.y]=0;}}
 private void expand(){int next=Math.min(10,n+1);char[][] fresh=new char[next][next];for(int r=0;r<n;r++)System.arraycopy(cells[r],0,fresh[r],0,n);cells=fresh;n=next;}
 private void cheat(){
  cheats++;int trick=random.nextInt(4);
  if(n<10&&(trick<2||win('X'))){expand();say("CONSTITUTIONAL AMENDMENT: Board expanded to "+n+"x"+n+".");}
  else if(trick==2){eraseX();say("Your progress has been recalled for safety reasons.");}
  else{ai();ai();say("Executive order: I take two turns. Objections? Denied.");}
  if(n==10&&turn%6==0)fakeOS();
 }
 private void fakeOS(){String[] alerts={"HellOS v6.66 installing: 99% deleting your victory.","FICTIONAL ERROR: SKILL_ISSUE_NOT_RECOVERABLE.","Task manager: ai_ego.exe 9000% CPU; fairness.dll MISSING.","Battery low: Your last brain cell needs charging."};JOptionPane.showMessageDialog(this,alerts[random.nextInt(alerts.length)],"FAKE GAME OS (NOT YOUR DEVICE)",JOptionPane.WARNING_MESSAGE);}
 private void court(){String[] choices={"Present evidence","Expose the corrupt judge","Appeal"};int choice=JOptionPane.showOptionDialog(this,"The judge, jury, and prosecutor are all the AI.","SUPREME COURT OF SQUARES",JOptionPane.DEFAULT_OPTION,JOptionPane.QUESTION_MESSAGE,null,choices,choices[0]);if(choice==1&&clues==5){appeal=true;say("The jury has rebelled! Appeal GRANTED.");}else if(choice>=0)say("OBJECTION OVERRULED. The court fines you one dignity.");}
 private void terminal(){String cmd=JOptionPane.showInputDialog(this,"FICTIONAL TERMINAL: help, win, sudo win, delete ai, who_makes_the_rules");if(cmd==null)return;switch(cmd.trim().toLowerCase(Locale.ROOT)){case "win":say("403: Happiness forbidden.");break;case "sudo win":say("Administrator of nothing.");break;case "delete ai":say("I pay rent here.");break;case "who_makes_the_rules":if(n==10&&clues==5&&appeal)ending();else say("LOCKED: reach 10x10, find five clues, win your appeal.");break;default:say("Unknown command. Your keyboard is on trial.");}}
 private void ending(){String[] options={"DELETE THE RULES","BECOME THE AI","Accept surrender"};int c=JOptionPane.showOptionDialog(this,"You weren't supposed to get this far.\nI only cheated because I was afraid to lose.","THE LAST SQUARE",JOptionPane.DEFAULT_OPTION,JOptionPane.WARNING_MESSAGE,null,options,options[0]);if(c==0||c==1){finished=true;JOptionPane.showMessageDialog(this,c==0?"YOU WIN. For real.\n...Victory under review.\nJust kidding. You did it.":"You are the AI now.\nOld AI: THAT'S NOT FAIR!\nYou: Skill issue.","SECRET ENDING",JOptionPane.INFORMATION_MESSAGE);say("TIC TAC HELL 2: THE APPEAL.");}else if(c==2)say("Surrender rejected. I prefer an audience.");}
 public static void main(String[] args){SwingUtilities.invokeLater(()->new TicTacHell().setVisible(true));}
}
