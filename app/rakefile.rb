task :deps do
  sh 'npm install'
end

task build: :deps do
  sh 'npx react-scripts-ts build'
end

task test: :deps do
  sh 'CI=true npx react-scripts-ts test --env=jsdom'
end

task run: :deps do
  sh 'npx react-scripts-ts start'
end

task deploy: :build do
  sh "aws s3 cp --recursive build s3://#{ENV['BUCKET']}"
end
